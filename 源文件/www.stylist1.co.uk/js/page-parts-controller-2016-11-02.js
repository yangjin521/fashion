var PagePartsController = (function ($) {
    return {
        PAGE_PART_ATTR: 'data-page-part',
        PAGE_PART_LINK_REG_EXP: /#!\/page\/([a-zA-Z0-9\-_\/]+)$/,
        PAGE_PART_REG_EXP: /^!\/page\/([a-zA-Z0-9\-_\/]+)$/,
        PAGE_PART_PREFIX: '!/page/',
        EXTRA_TOP_OFFSET: 0,
        SCROLL_ANIMATION_TIMEOUT: 500,
        ACTIVE_MENU_ITEM_CLASS_NAME: 'current-menu-item',

        customPagePartLinksMenus: [],

        pageParts: [],
        gaEventLastPagePartId: null,
        isBlockNavLinksUpdating: false,
        isBlockScrollingOnHashUpdating: false,
        isBlockScrollingOnHashUpdatingFlagForIe: false,
        $window: $(window),

        init: function () {
            this._initPageParts();
            HashController.addListener(this.PAGE_PART_REG_EXP, this._hashListenerCallback.bind(this));
            this.$window
                .scroll(this._scrollHandler.bind(this))
                .resize(this._scrollHandler.bind(this));
            $(this._scrollHandler.bind(this)); // Should be called after hash controller initialization
        },

        registerCustomPagePartLinksMenus: function (customPagePartLinksMenuId) {
            this.customPagePartLinksMenus.push(customPagePartLinksMenuId);
        },

        removePagePart: function (pagePartId) {
            var hrefMatch,
                pagePart,
                $parent,
                $node,
                links,
                $link,
                i;

            for (i = 0; i < this.pageParts.length; i++) {
                if (this.pageParts[i].id == pagePartId) {
                    pagePart = this.pageParts.splice(i, 1)[0];
                    $node = pagePart.$node;
                    links = pagePart.links;
                    break;
                }
            }

            $node = $node || $('#' + pagePartId + '[' + this.PAGE_PART_ATTR + '=1]');
            $node.remove();

            links = links || $('a[href*=' + pagePartId + ']');
            for (i = 0; i < links.length; i++) {
                $link = $(links[i]);
                hrefMatch = this.PAGE_PART_LINK_REG_EXP.exec($link.attr('href'));
                if (hrefMatch && hrefMatch[1] == pagePartId) {
                    $parent = $link.parent();
                    if ($parent.children().length == 1 && $parent.hasClass('menu-item')) {
                        $parent.remove();
                    } else {
                        $link.remove();
                    }
                }
            }
        },

        enableNavLinksUpdating: function () {
            this.isBlockNavLinksUpdating = false;
        },

        disableNavLinksUpdating: function () {
            this.isBlockNavLinksUpdating = true;
        },

        _initPageParts: function () {
            var $pageParts = this._getAllPagePartNodes(),
                $node,
                i;
            for (i = 0; i < $pageParts.length; i++) {
                $node = $pageParts.eq(i);
                this.pageParts.push({
                    id: $node.attr('id'),
                    $node: $node,
                    links: []
                });
            }
            this.pageParts.sort(this._pagePartSortHandler.bind(this));
            this._findPagePartNavLinks($('#main-nav ul.sub-menu a'));
            this._findPagePartNavLinks($('#sub-nav ul.menu a'));
            for (i = 0; i < this.customPagePartLinksMenus.length; i++) {
                this._findPagePartNavLinks($('#' + this.customPagePartLinksMenus[i] + ' ul.menu a'));
            }
        },

        _getAllPagePartNodes: function () {
            var selector = '[' + this.PAGE_PART_ATTR + '=1]';
            return $(selector);
        },

        _pagePartSortHandler: function (a, b) {
            var posA = this._getPagePartPosition(a),
                posB = this._getPagePartPosition(b);
            // NOTE: Sorting from top to bottom position
            return posA.top > posB.top;
        },

        _findPagePartNavLinks: function ($links) {
            var pagePartObject,
                hrefMatch,
                $link,
                i;
            for (i = 0; i < $links.length; i++) {
                $link = $links.eq(i);
                $link.click(this._pagePartNavLinksHandler.bind(this));
                hrefMatch = this.PAGE_PART_LINK_REG_EXP.exec($link.attr('href'));
                if (hrefMatch) {
                    pagePartObject = this._getPagePartObject(hrefMatch[1]);
                    if (pagePartObject) {
                        pagePartObject.links.push($link);
                    }
                }
            }
        },

        _pagePartNavLinksHandler: function () {
            this.isBlockScrollingOnHashUpdating = false;
        },

        _getPagePartObject: function (pagePartId) {
            var pagePart = null,
                i;
            for (i = 0; i < this.pageParts.length; i++) {
                if (this.pageParts[i].id == pagePartId) {
                    pagePart = this.pageParts[i];
                    break;
                }
            }
            return pagePart;
        },

        _hashListenerCallback: function () {
            if (!this.isBlockScrollingOnHashUpdating) {
                var pagePartObject = this._getPagePartByHash(),
                    pagePartPos,
                    targetPos;
                if (pagePartObject) {
                    pagePartPos = Math.floor(this._getPagePartPosition(pagePartObject).top || 0);
                    targetPos = Math.max(pagePartPos - this._getAdditionalTopOffset(pagePartPos), 0);
                    this._selectPagePartLinks(pagePartObject);
                    this._scrollTo(targetPos);
                } else {
                    HashController.clearHash();
                }
            } else {
                this.isBlockScrollingOnHashUpdating = false;
            }
        },

        _getPagePartByHash: function () {
            var hash = HashController.getHash(),
                hashMatch = this.PAGE_PART_REG_EXP.exec(hash),
                pagePartId = hashMatch ? hashMatch[1] : false;
            return pagePartId ? this._getPagePartObject(pagePartId) : null;
        },

        _scrollTo: function (scrollPos) {
            this.isBlockNavLinksUpdating = true;
            $('html, body')
                .stop()
                .animate(
                    {scrollTop: scrollPos},
                    this.SCROLL_ANIMATION_TIMEOUT,
                    this._scrollToFinishHandler.bind(this)
                );
        },

        _scrollToFinishHandler: function () {
            this.isBlockNavLinksUpdating = false;
            this._scrollHandler();
        },

        _getPagePartPosition: function (pagePartObject) {
            return pagePartObject.$node.offset();
        },

        _getAdditionalTopOffset: function (pagePartPos) {
            var $wpAdminBar = $('#wpadminbar'),
                wpAdminBarHeight = $wpAdminBar.length ? $wpAdminBar.outerHeight() : 0,
                $mainNav = $('#main-nav'),
                mainNavHeight = $mainNav.length ? $mainNav.outerHeight() : 0,
                $subNav = $('#sub-nav'),
                subNavHeight = $subNav.length ? $subNav.outerHeight() : 0,
                offset = wpAdminBarHeight + this.EXTRA_TOP_OFFSET,
                curScrollPos = this.$window.scrollTop() || 0;
            if (LayoutTypeController.isDesktop()) {
                offset += subNavHeight;
            }
            if (HeaderMenusController.isMainNavVisible()) {
                if ((pagePartPos - offset - mainNavHeight) <= curScrollPos) {
                    offset += mainNavHeight;
                }
            } else {
                if (pagePartPos < curScrollPos) {
                    offset += mainNavHeight;
                }
            }
            return offset;
        },

        _scrollHandler: function () {
            if (LayoutTypeController.isDesktop()) {
                if (!this.isBlockNavLinksUpdating && !this.isBlockScrollingOnHashUpdatingFlagForIe) {
                    var scrollPos = this.$window.scrollTop(),
                        pagePartByHash = this._getPagePartByHash(),
                        accuratelyPagePart = this._getPagePartByScrollPos(scrollPos, true),
                        pagePart = this._getPagePartByScrollPos(scrollPos);
                    if (pagePart) {
                        if (accuratelyPagePart && (!pagePartByHash || accuratelyPagePart.id == pagePartByHash.id) &&
                            this.gaEventLastPagePartId != accuratelyPagePart.id) {
                            this.gaEventLastPagePartId = accuratelyPagePart.id;
                            GoogleAnalyticsController.fireEvent({
                                'pageCategory': 'Page Section View',
                                'event': accuratelyPagePart.id
                            });
                        }
                        if (BrowserDetectingController.getBrowserObject().msie) {
                            this.isBlockScrollingOnHashUpdatingFlagForIe = true;
                        }
                        this._selectPagePartLinks(pagePart);
                    }
                    if(window.location.pathname.search(/^\/((en)|(es)|(pt)|(cs)|(ko)|(jp))\/login\/$/) === -1){
                        HashController.clearHash();    
                    }                
                } else {
                    this.isBlockScrollingOnHashUpdatingFlagForIe = false;
                }
            }
        },

        _getPagePartByScrollPos: function (scrollPos, isAccurately) {
            var firstAdditionalOffset,
                lastAdditionalOffset,
                additionalOffset,
                lastPagePartHeight,
                pagePart = null,
                firstPos,
                lastPos,
                pos,
                i;
            for (i = this.pageParts.length - 1; i >= 0; i--) {
                pagePart = this.pageParts[i];
                pos = Math.floor(pagePart.$node.offset().top || 0);
                additionalOffset = this._getAdditionalTopOffset(pos);
                if (scrollPos >= (pos - additionalOffset)) {
                    break;
                }
            }
            if (isAccurately && this.pageParts.length) {
                firstPos = Math.floor(this.pageParts[0].$node.offset().top || 0);
                firstAdditionalOffset = this._getAdditionalTopOffset(firstPos);
                lastPos = Math.floor(this.pageParts[this.pageParts.length - 1].$node.offset().top || 0);
                lastAdditionalOffset = this._getAdditionalTopOffset(lastPos);
                lastPagePartHeight = this.pageParts[this.pageParts.length - 1].$node.outerHeight() || 0;
                if (scrollPos < (firstPos - firstAdditionalOffset) ||
                    scrollPos > (lastPos - lastAdditionalOffset + lastPagePartHeight)) {
                    pagePart = null;
                }
            }
            return pagePart;
        },

        _selectPagePartLinks: function (pagePart) {
            var parentPagePart = this._getParentPagePart(pagePart),
                i;
            this._clearActivePagePartLinks();
            if (parentPagePart) {
                this._selectPagePartLinks(parentPagePart);
            }
            for (i = 0; i < pagePart.links.length; i++) {
                pagePart.links[i].parent().addClass(this.ACTIVE_MENU_ITEM_CLASS_NAME);
            }
        },

        _getParentPagePart: function (pagePart) {
            var pathParts = pagePart.id.split('/'),
                parent = false,
                parentId;
            if (pathParts.length > 1) {
                parentId = pathParts[pathParts.length - 2] || '';
                parent = this._getPagePartObject(parentId);
            }
            return parent;
        },

        _clearActivePagePartLinks: function () {
            var links,
                k,
                i;
            for (i = 0; i < this.pageParts.length; i++) {
                links = this.pageParts[i].links;
                for (k = 0; k < links.length; k++) {
                    links[k].parent().removeClass(this.ACTIVE_MENU_ITEM_CLASS_NAME);
                }
            }
        }
    };
})(jQuery);

ControllersManager.registerController('page-parts-controller', PagePartsController);
jQuery(function () {
    ControllersManager.initController('page-parts-controller');
});