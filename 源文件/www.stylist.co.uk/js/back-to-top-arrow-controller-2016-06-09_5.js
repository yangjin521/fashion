var BackToTopArrowController = (function ($) {
    return {
        $arrow: null,
        $headerTopCarousel: null,
        $window: null,

        SCROLL_ANIMATION_TIMEOUT: 500,
        SHOW_HIDE_ANIMATION_TIMEOUT: 200,
        SHOW_ARROW_OPACITY: 0.6,

        init: function () {
            this.$arrow = $('#back-to-top-arrow');
            this.$headerTopCarousel = $('#header-top-carousel');
            this.$window = $(window);
            this.$arrow.click(this._scrollToTop.bind(this));
            this.$window.scroll(this._checkScrollPosition.bind(this));
            this._checkScrollPosition();
        },

        _scrollToTop: function () {
            $('html, body')
                .stop()
                .animate({scrollTop: 0}, this.SCROLL_ANIMATION_TIMEOUT);
        },

        _checkScrollPosition: function () {
            if (this.$window.scrollTop() > this.$headerTopCarousel.height()) {
                this._showArrow();
            } else {
                this._hideArrow()
            }
        },

        _showArrow: function () {
            this.$arrow
                .css({display: 'block'})
                .stop()
                .animate({opacity: this.SHOW_ARROW_OPACITY}, this.SHOW_HIDE_ANIMATION_TIMEOUT);
        },

        _hideArrow: function () {
            this.$arrow
                .stop()
                .animate({opacity: 0}, this.SHOW_HIDE_ANIMATION_TIMEOUT , (function () {
                    this.$arrow.css({display: 'none'});
                }).bind(this));
        }
    };
})(jQuery);

ControllersManager.registerController('back-to-top-arrow-controller', BackToTopArrowController);
jQuery(function () {
    ControllersManager.initController('back-to-top-arrow-controller');
});