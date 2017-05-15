var HeaderProgressBarController = (function ($) {
    return {
        $indicatorNode: null,
        $window: null,
        $html: null,

        init: function () {
            this.$indicatorNode = $('#header-scroll-progress-indicator');
            this.$window = $(window);
            this.$html = $('html');
            this.$window
                .scroll(this.update.bind(this))
                .resize(this.update.bind(this));
            this.update();
        },

        update: function () {
            if (LayoutTypeController.isDesktop()) {
                var documentMargins = (parseInt(this.$html.css('marginTop'), 10) || 0) + (parseInt(this.$html.css('marginBottom'), 10) || 0),
                    maxScrollTop = this.$html.outerHeight() + documentMargins - this.$window.height(),
                    ratio = this.$window.scrollTop() / maxScrollTop,
                    size = Math.min(Math.max(Math.floor(100 * ratio), 0), 100);
                this.$indicatorNode.css({width: size + '%'});
            }
        }
    };
})(jQuery);

ControllersManager.registerController('header-progress-bar-controller', HeaderProgressBarController);
jQuery(function () {
    ControllersManager.initController('header-progress-bar-controller');
});