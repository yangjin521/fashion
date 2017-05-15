/**
 * Update scroll position when window resize or device orientation change
 * This is almost magic, for orientationchange works from time to time
 */
var ResizeScrollPositionController = (function ($) {
    return {
        prevScrollPos: 0,
        prevBodyHeight: 0,
        scrollPos: 0,
        bodyHeight: 0,
        goDownTimeoutId: 0,
        goDownTimeoutFlag: false,
        goDownFlag: false,
        goDownTimeout: 500,
        $window: $(window),
        isBlockUpdateScroll: false,
        state: 0,

        init: function () {
            this.$window
                .resize(this._orientationChangeHandler.bind(this))
                .scroll(this._scrollHandler.bind(this));
            this._scrollHandler();
        },

        _scrollHandler: function () {
            if (this.isBlockUpdateScroll && PagePartsController.isBlockNavLinksUpdating) {
                this._goDown();
            } else {
                if (!this.goDownTimeoutFlag) {
                    if (!this.goDownFlag) {
                        this.prevScrollPos = this.scrollPos;
                        this.prevBodyHeight = this.bodyHeight;
                        this.scrollPos = this.$window.scrollTop() || 0;
                        this.bodyHeight = document.body.scrollHeight;
                    }
                    this.goDownFlag = false;
                }
                this.goDownTimeoutFlag = false;
            }
        },

        _goDown: function () {
            if (this.goDownTimeoutId) {
                clearTimeout(this.goDownTimeoutId);
                this.goDownTimeoutId = 0;
            }
            this.goDownFlag = true;
            var newHeight = document.body.scrollHeight;
            $.mobile.silentScroll(Math.round(this.prevScrollPos * newHeight / this.prevBodyHeight));
            this.isBlockUpdateScroll = false;
            PagePartsController.enableNavLinksUpdating();
            this._scrollHandler();
        },

        _orientationChangeHandler: function () {
            this.isBlockUpdateScroll = true;
            PagePartsController.disableNavLinksUpdating();
            this.goDownTimeoutId = setTimeout((function () {
                this.goDownTimeoutFlag = true;
                this._goDown();
            }).bind(this), this.goDownTimeout);
        }
    };
})(jQuery);

ControllersManager.registerController('resize-scroll-position-controller', ResizeScrollPositionController);
jQuery(function () {
    ControllersManager.initController('resize-scroll-position-controller');
});