var PageCarouselController = (function ($) {
    function PageCarouselController(config) {
        this.config = this._fillDefaultValues(config, PageCarouselController.DEFAULT_CONFIG);
        this.$carousel = null;
        this.$carouselContainer = null;
        this.$leftArrow = null;
        this.$rightArrow = null;
        this.responsiveItemsCountOptions = [];
        this.currentItemsCount = 0;
        this.init();
    }

    PageCarouselController.MAX_ARROW_WIDTH = 150;
    PageCarouselController.DEFAULT_CONFIG = {
        loop: true,
        navSpeed: 180,
        items: 4,
        center: true,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            737: {
                items: 3
            },
            1025: {
                items: 4
            }
        }
    };

    PageCarouselController.prototype.init = function () {
        this.$carouselContainer = this.config.carouselContainerId ? $('#' + this.config.carouselContainerId) : null;
        this.$leftArrow = this.config.leftArrowId ? $('#' + this.config.leftArrowId) : null;
        this.$rightArrow = this.config.rightArrowId ? $('#' + this.config.rightArrowId) : null;

        this.$carouselContainer.css({opacity: 0});

        this._initResponsive();
        this.currentItemsCount = this._calculateCurrentItemsPerPageCount();

        this._addEmptyBlocks();
        this._initCarousel();

        this._checkArrowSizes();
        if (this.$leftArrow && this.$leftArrow.length) {
            this.$leftArrow.click(this._arrowClickHandler.bind(this, false));
        }
        if (this.$rightArrow && this.$rightArrow.length) {
            this.$rightArrow.click(this._arrowClickHandler.bind(this, true));
        }

        this.$carouselContainer.css({opacity: 1});
    };

    PageCarouselController.prototype._initCarousel = function () {
        var numberOfContentBlocks = this.$carouselContainer.children().length,
            numberOfBlocksPerPage = this.currentItemsCount,
            numberOfPages = numberOfContentBlocks / numberOfBlocksPerPage;
        this._initArrows(numberOfPages);
        this.$carousel = this.$carouselContainer.owlCarousel({
            loop: this.config.loop,
            mouseDrag: false,
            dots: this.config.dots && numberOfPages > 1,
            navSpeed: this.config.navSpeed,
            items: this.currentItemsCount,
            onChanged: this._swipeFixHandler.bind(this) // NOTE: For swiping pages, not items
        }).data('owlCarousel');
    };

    PageCarouselController.prototype._initArrows = function (numberOfPages) {
        if (this.$leftArrow && this.$leftArrow.length &&
            this.$rightArrow && this.$rightArrow.length) {
            if (numberOfPages > 1) {
                this.$leftArrow.show();
                this.$rightArrow.show();
            } else {
                this.$leftArrow.hide();
                this.$rightArrow.hide();
            }
        }
    };

    PageCarouselController.prototype._checkArrowSizes = function () {
        if (this.$leftArrow && this.$rightArrow) {
            var leftOffset = this.$leftArrow.offset().left,
                leftPos = parseInt(this.$leftArrow.css('left'), 10) || 0,
                width = this.$leftArrow.outerWidth(),
                isCheck = leftPos < 0;
            if (isCheck && (leftOffset < 0 || width < PageCarouselController.MAX_ARROW_WIDTH)) {
                leftOffset *= -1;
                width = Math.min(width - leftOffset, PageCarouselController.MAX_ARROW_WIDTH);
                this.$leftArrow.css({width: width, left: -1 * width});
                this.$rightArrow.css({width: width, right: -1 * width});
            }
        }
    };

    PageCarouselController.prototype._swipeFixHandler = function () {
        var carousel = this.$carousel,
            current;
        if (carousel) {
            current = carousel.current();
            if (current % this.currentItemsCount != 0) {
                if (carousel.state.direction == 'left') {
                    carousel.next();
                } else if (carousel.state.direction == 'right') {
                    carousel.prev();
                }
            }
        }
    };

    PageCarouselController.prototype._initResponsive = function () {
        var responsive = this.config.responsive,
            keyVal,
            key;
        if (responsive) {
            $(window).resize(this._responsiveResizeHandler.bind(this));
            for (key in responsive) if (responsive.hasOwnProperty(key)) {
                keyVal = parseInt(key, 10);
                if (!isNaN(keyVal) && responsive[key].items) {
                    this.responsiveItemsCountOptions.push({
                        width: keyVal,
                        itemsCount: responsive[key].items
                    });
                }
            }
        }
        // NOTE: Sort from smallest to largest screen width
        this.responsiveItemsCountOptions = this.responsiveItemsCountOptions.sort(function (a, b) {
            return a.width > b.width;
        });
    };

    PageCarouselController.prototype._responsiveResizeHandler = function () {
        var recalculatedItemsCount = this._calculateCurrentItemsPerPageCount(),
            containerChildren;
        this._checkArrowSizes();
        if (this.currentItemsCount != recalculatedItemsCount) {
            this.currentItemsCount = recalculatedItemsCount;
            this.$carouselContainer.hide();
            this.$carousel.destroy();
            this.$carousel = null;
            containerChildren = this.$carouselContainer.children();
            if (containerChildren.length == 1 && containerChildren[0].className == 'owl-stage-outer') {
                this.$carouselContainer.append(containerChildren[0].children);
                $(this.$carouselContainer.children()[0]).remove();
            }
            this._removeEmptyBlocks();
            this._addEmptyBlocks();
            this._initCarousel();
            this.$carouselContainer.show();
        }
    };

    PageCarouselController.prototype._calculateCurrentItemsPerPageCount = function () {
        var pageWidth = this._getPageWidth(),
            basicItemsCount = this.config.items,
            itemsCount = basicItemsCount,
            res,
            i;
        for (i = 0; i < this.responsiveItemsCountOptions.length; i++) {
            res = this.responsiveItemsCountOptions[i];
            if (pageWidth >= res.width) {
                itemsCount = (res.itemsCount || res.itemsCount == 0) ? res.itemsCount : basicItemsCount;
            } else {
                break;
            }
        }
        return itemsCount;
    };

    PageCarouselController.prototype._getPageWidth = function () {
        return window.innerWidth || 0;
    };

    PageCarouselController.prototype._addEmptyBlocks = function () {
        var numberOfContentBlocks = this.$carouselContainer.children().length,
            numberOfBlocksPerPage = this.currentItemsCount,
            targetNumberOfBlocks = Math.round(Math.ceil(numberOfContentBlocks / numberOfBlocksPerPage) * numberOfBlocksPerPage),
            numberOfEmptyBlocks = targetNumberOfBlocks - numberOfContentBlocks,
            $node,
            i;
        for (i = 0; i < numberOfEmptyBlocks; i++) {
            $node = $('<div class="page-carousel-empty-block">');
            this.$carouselContainer.append($node);
        }
    };

    PageCarouselController.prototype._removeEmptyBlocks = function () {
        this.$carouselContainer.find('.page-carousel-empty-block').remove();
    };

    PageCarouselController.prototype._fillDefaultValues = function (config, defaultConfig) {
        var result = {},
            key;
        for (key in defaultConfig) if (defaultConfig.hasOwnProperty(key)) {
            result[key] = defaultConfig[key];
        }
        for (key in config) if (config.hasOwnProperty(key)) {
            result[key] = config[key];
        }
        return result;
    };

    PageCarouselController.prototype._arrowClickHandler = function (isNext) {
        if (this.$carousel) {
            var carousel = this.$carousel,
                deltaSign = isNext ? 1 : -1,
                pos = carousel.relative(carousel.current()) + deltaSign * this.currentItemsCount;
            this.$carousel.to(pos, this.config.navSpeed, true);
        }
    };

    return PageCarouselController;
})(jQuery);

ControllersManager.registerController('page-carousel-controller', PageCarouselController);