var GoogleAnalyticsController = (function ($) {
    return {
        gaTrackingId: 'UA-1004012-2',
        sentPageViews: [],

        init: function () {
            window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
            ga('create', this.gaTrackingId, 'auto');
            //ga('send', 'pageview');
        },

        sendPageView: function (address) {
            if ($.inArray(address, this.sentPageViews) == -1) {
                console.log('send pageview', address);
                ga('send', 'pageview', address);
                this.addSentPageView(address);
            }
        },

        addSentPageView: function (address) {
            this.sentPageViews.push(address);
        },

        fireEvent: function (opts) {
            if (window.dataLayer){
                window.dataLayer.push(opts);
            }
        }
    };
})(jQuery);

ControllersManager.registerController('google-analytics-controller', GoogleAnalyticsController);
jQuery(function () {
    ControllersManager.initController('google-analytics-controller');
});