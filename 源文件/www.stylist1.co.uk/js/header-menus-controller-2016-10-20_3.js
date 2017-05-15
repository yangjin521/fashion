var HeaderMenusController = (function ($) {
    return {
        $rootContainer: null,
        $header: null,
        $wpAdminBar: null,

        $mainNav: null,
        $mainNavMenu: null,
        $subNav: null,
        $subNavMenu: null,
        $movableToSubNavBar: null,

        $window: null,
        prevScrollTop: 0,
        prevDirection: 'up',
        touchScrollHandlerInterval: 0,
        isSubNavMenuShifted: false,

        CSS_TRANSITION_DELAY: 300,
        MAIN_NAV_HIDDEN_SUB_MENUS_CLASS_NAME: 'hidden-sub-menus',
        MAIN_NAV_SCROLL_DOWN_CLASS_NAME: 'scroll-down',
        MAIN_NAV_SCROLL_UP_CLASS_NAME: 'scroll-up',
        NAV_NO_TRANSITION_CLASS_NAME: 'no-transition',
        NAV_STICKY_CLASS_NAME: 'sticky',
        NAV_FIXED_CLASS_NAME: 'fixed',
        MOVABLE_TO_SUB_NAV_BAR: 'movable-to-sub-nav-bar',

        init: function () {

            var $activeSubMenu;

            this.$rootContainer = $('#container');
            this.$header = $('#header');
            this.$wpAdminBar = $('#wpadminbar');
            this.$mainNav = $('#main-nav');
            this.$mainNavMenu = this.$mainNav.find('ul.menu');
            this.$subNav = $('#sub-nav');
            this.$subNavMenu = this.$subNav.find('.menu');
            this.$movableToSubNavBar = this.$mainNav.find('.' + this.MOVABLE_TO_SUB_NAV_BAR);

            this._updateLinksByRegExp(PagePartsController.PAGE_PART_LINK_REG_EXP);
            this._updateLinksByRegExp(/\?[a-zA-Z-9\-_%]+=[a-zA-Z-9\-_%]+/);

            if (this.$subNav.length) {
                $activeSubMenu = this.$mainNavMenu.find('ul.sub-menu>li.current-menu-item>ul.sub-menu');
                if ($activeSubMenu.length == 0) {
                    $activeSubMenu = this.$mainNavMenu.find('li.current-menu-item>ul.sub-menu');
                }
                if ($activeSubMenu.length) {
                    this.$subNavMenu.html($activeSubMenu.html());
                }
            }
            this.$subNavMenu.addClass('show');
                
            if (LayoutTypeController.isDesktop()) {
                this._initMainNavSubMenuHoverState(); // Fix (Ctrl+F) issue (shifting menu items in case of matching words in sub menus)
                this._initScrollAnimation();
            }
        },

        isMainNavVisible: function () {
            var topPos = parseInt(this.$mainNav.css('top'), 10) || 0,
                topOffset = this._getTopOffsetFromWpAdminBar();
            return (topPos - topOffset) >= 0;
        },

        _updateLinksByRegExp: function (hrefRegExp) {
            var $links = this.$mainNavMenu.find('a'),
                hrefPrefix,
                $link,
                i;
            for (i = 0; i < $links.length; i++) {
                $link = $links.eq(i);
                if (hrefRegExp.test($link.attr('href'))) {
                    hrefPrefix = $link.parent().parent().prev().get(0).pathname || '';
                    hrefPrefix = '/' + hrefPrefix.replace(/(^\/|\/$)/g, '') + '/';
                    $link.attr('href', hrefPrefix + $link.attr('href'));
                }
            }
        },

        _initMainNavSubMenuHoverState: function () {
            var $mainNavItems = this.$mainNavMenu.children(),
                $itemNode,
                timeout,
                i;
            for (i = 0; i < $mainNavItems.length; i++) {
                $itemNode = $mainNavItems.eq(i);
                timeout = {id: 0};
                $itemNode
                    .mouseover(this._mainNavSubMenuHoverFixMouseOverHandler.bind(this, $itemNode, timeout))
                    .mouseleave(this._mainNavSubMenuHoverFixMouseLeaveHandler.bind(this, $itemNode, timeout));
            }
        },

        _mainNavSubMenuHoverFixMouseOverHandler: function ($node, timeoutObject) {
            if (timeoutObject.id) {
                clearTimeout(timeoutObject.id);
            }
            $node.addClass('hover');
        },

        _mainNavSubMenuHoverFixMouseLeaveHandler: function ($node, timeoutObject) {
            timeoutObject.id = setTimeout(
                this._mainNavSubMenuHoverFixMouseLeaveTimeoutHandler.bind(this, $node),
                this.CSS_TRANSITION_DELAY
            );
        },

        _mainNavSubMenuHoverFixMouseLeaveTimeoutHandler: function ($node) {
            $node.removeClass('hover');
        },

        _initScrollAnimation: function () {
            this.$window = $(window);
            this.prevScrollTop = this.$window.scrollTop();
            this.$window
                .scroll(this._scrollHandler.bind(this))
                .resize(this._scrollHandler.bind(this))
                .bind('touchstart', this._touchStartHandler.bind(this))
                .bind('touchend', this._touchEndHandler.bind(this));
            this._scrollHandler();
        },

        _touchStartHandler: function () {
            this.touchScrollHandlerInterval = setInterval(this._scrollHandler.bind(this), this.CSS_TRANSITION_DELAY);
        },

        _touchEndHandler: function () {
            clearInterval(this.touchScrollHandlerInterval);
            this.touchScrollHandlerInterval = 0;
        },

        _scrollHandler: function () {
            var newScroll = this.$window.scrollTop(),
                containerMarginTop = parseInt(this.$rootContainer.css('marginTop'), 10) || 0,
                maxScrollTop = this._getMaxScrollTop(),
                isScrollDown = newScroll > this.prevScrollTop || (newScroll == this.prevScrollTop && this.prevDirection == 'down') || newScroll >= maxScrollTop;
            newScroll = newScroll ? newScroll : (-1 * containerMarginTop);
            this.$mainNav
                .toggleClass(this.MAIN_NAV_SCROLL_DOWN_CLASS_NAME, isScrollDown)
                .toggleClass(this.MAIN_NAV_SCROLL_UP_CLASS_NAME, !isScrollDown)
                .toggleClass(this.NAV_NO_TRANSITION_CLASS_NAME, newScroll < 0 || newScroll > maxScrollTop);
            this.$subNav
                .toggleClass(this.MAIN_NAV_SCROLL_DOWN_CLASS_NAME, isScrollDown)
                .toggleClass(this.MAIN_NAV_SCROLL_UP_CLASS_NAME, !isScrollDown)
                .toggleClass(this.NAV_NO_TRANSITION_CLASS_NAME, newScroll < 0 || newScroll > maxScrollTop);

            this._desktopScrollHandler(newScroll);

            this.prevScrollTop = newScroll;
        },

        _getMaxScrollTop: function () {
            var $html = $('html'),
                documentMargins = (parseInt($html.css('marginTop'), 10) || 0) + (parseInt($html.css('marginBottom'), 10) || 0),
                documentHeight = $html.outerHeight();
            return documentHeight + documentMargins - this.$window.height();
        },

        _desktopScrollHandler: function (newScroll) {
            var maxScrollTop = this._getMaxScrollTop(),
                oldScroll = this.prevScrollTop;
            this.$mainNav.addClass(this.NAV_FIXED_CLASS_NAME);
            if (maxScrollTop <= 0) {
                return;
            }
            else if (newScroll <= maxScrollTop && newScroll >= 0) {
                if ((newScroll < oldScroll && newScroll < maxScrollTop) || (newScroll == oldScroll && this.prevDirection == 'up')) { // Up
                    this.prevDirection = 'up';
                    this._desktopScrollUpHandler(newScroll);
                } else if (newScroll > oldScroll || (newScroll == oldScroll && this.prevDirection == 'down')) { // Down
                    this.prevDirection = 'down';
                    this._desktopScrollDownHandler(newScroll);
                } else {
                    this.prevDirection = false;
                }
            } else if (newScroll > maxScrollTop) {
                // Need refactoring
                // Safari issue fix
                this.prevDirection = 'down';
                this._desktopScrollDownHandler(newScroll);
                var topOffset = this._getTopOffsetFromWpAdminBar();
                var offset = newScroll - maxScrollTop;
                this.$mainNav.addClass(this.NAV_NO_TRANSITION_CLASS_NAME);
                this.$mainNav.css({top: topOffset - this.$mainNav.height() - offset + 'px'});
                this.$subNav.css({top: topOffset - offset + 'px'});
            } else if (newScroll < 0) {
                // Need refactoring
                // Safari issue fix
                this.prevDirection = 'up';
                this._desktopScrollUpHandler(newScroll);
                this.$mainNav
                    .addClass(this.NAV_NO_TRANSITION_CLASS_NAME)
                    .css({top: -1 * newScroll});
            }
        },

        _desktopScrollDownHandler: function (newScroll) {
            var topOffset = this._getTopOffsetFromWpAdminBar(),
                headerHeight = this.$header.outerHeight(),
                mainNavHeight = this.$mainNav.outerHeight(),
                subNavHeight = this.$subNav.length ? this.$subNav.outerHeight() : 0,
                navsDistanse = this.$subNav.length ? (this.$subNav.offset().top - this.$mainNav.offset().top) : mainNavHeight,
                isStickyPointReached = this._isDownStickyPointReached(newScroll);
            if (newScroll >= mainNavHeight) {
                this.$mainNav.css({top: -1 * (mainNavHeight - topOffset) + 'px'});
                this.$mainNav.addClass(this.MAIN_NAV_HIDDEN_SUB_MENUS_CLASS_NAME);
            } else {
                this.$mainNav.css({top: topOffset - Math.min(newScroll, 0) + 'px'});
            }
            this.$mainNav.toggleClass(this.NAV_STICKY_CLASS_NAME, isStickyPointReached);
            this.$subNav.toggleClass(this.NAV_STICKY_CLASS_NAME, isStickyPointReached);
            this._desktopSubNavStickyPointCheck(isStickyPointReached, topOffset);
            if (navsDistanse < mainNavHeight && this.prevScrollTop < (topOffset + headerHeight - subNavHeight)) {
                this.$mainNav.addClass(this.NAV_NO_TRANSITION_CLASS_NAME);
            }
        },

        _desktopScrollUpHandler: function (newScroll) {
            var topOffset = this._getTopOffsetFromWpAdminBar(),
                mainNavHeight = this.$mainNav.outerHeight(),
                isStickyPointReached = this._isUpStickyPointReached(newScroll);
            this.$mainNav
                .removeClass(this.MAIN_NAV_HIDDEN_SUB_MENUS_CLASS_NAME)
                .css({top: topOffset - Math.min(newScroll, 0) + 'px'})
                .toggleClass(this.NAV_NO_TRANSITION_CLASS_NAME, newScroll < mainNavHeight)
                .toggleClass(this.NAV_STICKY_CLASS_NAME, isStickyPointReached);
            this.$subNav.toggleClass(this.NAV_STICKY_CLASS_NAME, isStickyPointReached);
            this._desktopSubNavStickyPointCheck(isStickyPointReached, topOffset + mainNavHeight);
        },

        _desktopSubNavStickyPointCheck: function (isStickyPointReached, top) {
            this._updateSubNavShifting(isStickyPointReached);
            if (isStickyPointReached) {
                if (!this.$subNav.hasClass(this.NAV_FIXED_CLASS_NAME)) {
                    this.$subNav.addClass(this.NAV_FIXED_CLASS_NAME)
                }
                this.$subNav.css({top: top + 'px'});
            } else {
                this._desktopMoveSubNavToDefaultPlace();
            }
        },

        /** @deprecated */
        _updateSubNavShifting: function (isStickyPointReached) {
            if (this.$subNavMenu.length) {
                var menuLeft = this.$subNavMenu.offset().left,
                    rightSide = [],
                    leftSide = [],
                    nodeLeft,
                    $node,
                    i;
                if (isStickyPointReached) {
                    if (!this.isSubNavMenuShifted) {
                        this.isSubNavMenuShifted = true;
                        for (i = 0; i < this.$movableToSubNavBar.length; i++) {
                            $node = this.$movableToSubNavBar.eq(i);
                            nodeLeft = $node.offset().left;
                            if (nodeLeft < menuLeft) {
                                leftSide.push($node.outerWidth());
                            } else {
                                rightSide.push($node.outerWidth());
                            }
                        }
                        this.$subNavMenu.css({
                            marginRight: rightSide.length ? Math.max.apply(Math, rightSide) : 0,
                            marginLeft: leftSide.length ? Math.max.apply(Math, leftSide) : 0
                        });
                    }
                } else {
                    this.isSubNavMenuShifted = false;
                    this.$subNavMenu.css({
                        marginRight: 0,
                        marginLeft: 0
                    });
                }
            }
        },

        _desktopMoveSubNavToDefaultPlace: function () {
            if (this.$subNav.hasClass(this.NAV_FIXED_CLASS_NAME)) {
                this.$subNav
                    .addClass(this.NAV_NO_TRANSITION_CLASS_NAME)
                    .removeClass(this.NAV_FIXED_CLASS_NAME)
                    .css({top: 'auto'});
            }
        },

        _isUpStickyPointReached: function (newScroll) {
            var mainNavHeight = this.$mainNav.outerHeight(),
                subNavHeight = this.$subNav.outerHeight() || 0,
                headerHeight = this.$header.outerHeight();
            return newScroll >= (headerHeight - mainNavHeight - subNavHeight);
        },

        _isDownStickyPointReached: function (newScroll) {
            var subNavHeight = this.$subNav.outerHeight() || 0,
                headerHeight = this.$header.outerHeight();
            return newScroll > (headerHeight - subNavHeight);
        },

        _mobileScrollHandler: function (newScroll) {
            var wpAdminBarHeight = this._getWpAdminBarHeight(),
                topOffset = this._getTopOffsetFromWpAdminBar(),
                mainNavHeight = this.$mainNav.outerHeight(),
                oldScroll = this.prevScrollTop,
                isFixed;
            if (newScroll <= (wpAdminBarHeight + mainNavHeight)) {
                isFixed = newScroll > wpAdminBarHeight || (topOffset == wpAdminBarHeight && newScroll > 0);
                this.$mainNav
                    .addClass(this.NAV_NO_TRANSITION_CLASS_NAME)
                    .toggleClass(this.NAV_FIXED_CLASS_NAME, isFixed)
                    .css({top: (topOffset == wpAdminBarHeight && newScroll > 0)
                        ? wpAdminBarHeight
                        : (isFixed ? (-1 * Math.min(newScroll, 0)) : 0)
                    });
            } else {
                this.$mainNav
                    .addClass(this.NAV_FIXED_CLASS_NAME)
                    .removeClass(this.NAV_NO_TRANSITION_CLASS_NAME);
                if (newScroll < oldScroll || (newScroll == oldScroll && this.prevDirection == 'up')) { // Up
                    this.prevDirection = 'up';
                    this.$mainNav.css({top: topOffset});
                } else if (newScroll > oldScroll || (newScroll == oldScroll && this.prevDirection == 'down')) { // Down
                    this.prevDirection = 'down';
                    this.$mainNav.css({top: topOffset - mainNavHeight + 'px'});
                } else {
                    this.prevDirection = false;
                }
            }
        },

        _getWpAdminBarHeight: function () {
            return this.$wpAdminBar.length ? this.$wpAdminBar.outerHeight() : 0;
        },

        _getTopOffsetFromWpAdminBar: function () {
            var wpAdminBarTopOffset = this.$wpAdminBar.length ? this.$wpAdminBar.get(0).getBoundingClientRect().top : 0,
                wpAdminBarHeight = this._getWpAdminBarHeight();
            return Math.max(wpAdminBarHeight + wpAdminBarTopOffset, 0);
        }
    };
})(jQuery);

ControllersManager.registerController('header-menus-controller', HeaderMenusController);
jQuery(function () {
    ControllersManager.initController('header-menus-controller');
});