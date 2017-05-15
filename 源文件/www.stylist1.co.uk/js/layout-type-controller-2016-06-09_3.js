var LayoutTypeController = (function ($) {
    return {
        SMALL_MOBILE_LAYOUT_MAX_WIDTH: 480,
        MOBILE_LAYOUT_MAX_WIDTH: 736,
        PORTRAIT_TABLET_LAYOUT_MAX_WIDTH: 1024,
        TABLET_LAYOUT_MAX_WIDTH: 1200,

        isSmallMobileLayout: function () {
            var pageWidth = this._getPageWidth();
            return pageWidth <= this.SMALL_MOBILE_LAYOUT_MAX_WIDTH;
        },

        isMobileLayout: function () {
            var pageWidth = this._getPageWidth();
            return pageWidth > this.SMALL_MOBILE_LAYOUT_MAX_WIDTH && pageWidth <= this.MOBILE_LAYOUT_MAX_WIDTH;
        },

        isPortraitTabletLayout: function () {
            var pageWidth = this._getPageWidth();
            return pageWidth > this.MOBILE_LAYOUT_MAX_WIDTH && pageWidth <= this.PORTRAIT_TABLET_LAYOUT_MAX_WIDTH;
        },

        isTabletLayout: function () {
            var pageWidth = this._getPageWidth();
            return pageWidth > this.PORTRAIT_TABLET_LAYOUT_MAX_WIDTH && pageWidth <= this.TABLET_LAYOUT_MAX_WIDTH;
        },

        isMobile: function () {
            return this.isSmallMobileLayout() || this.isMobileLayout();
        },

        isTablet: function () {
            return this.isPortraitTabletLayout() || this.isTabletLayout();
        },

        isDesktop: function () {
            return this._getPageWidth() > this.TABLET_LAYOUT_MAX_WIDTH;
        },

        _getPageWidth: function () {
            return window.innerWidth || $(window).width() || 0;
        }
    };
})(jQuery);

ControllersManager.registerController('layout-type-controller', LayoutTypeController);