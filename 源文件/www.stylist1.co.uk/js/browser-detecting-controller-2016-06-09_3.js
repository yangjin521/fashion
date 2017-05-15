var BrowserDetectingController = (function ($) {
    return {
        userAgent: navigator.userAgent.toLowerCase(),
        browser: null,

        init: function () {
            this.browser = {
                version:       (this.userAgent.match(new RegExp(".+(?:me|ox|on|rv|it|era|ie)[\\/: ]([\\d.]+)")) || [0,'0'])[1] * 1,
                msie:          ((/msie/i.test(this.userAgent)) && !(/opera/i.test(this.userAgent))) || (/Trident.*rv[ :]*11\./i.test(this.userAgent)),
                msie9:         ((/msie 9/i.test(this.userAgent)) && !(/opera/i.test(this.userAgent))),
                msie11:        (/Trident.*rv[ :]*11\./i.test(this.userAgent)),
                firefox:       /firefox/i.test(this.userAgent),
                chrome:        /chrome/i.test(this.userAgent),
                safari:        (!(/chrome/i.test(this.userAgent)) && (/webkit|safari|khtml/i.test(this.userAgent))),
                iphone:        /iphone/i.test(this.userAgent),
                ipod:          /ipod/i.test(this.userAgent),
                iphone4:       /iphone.*OS 4/i.test(this.userAgent),
                ipod4:         /ipod.*OS 4/i.test(this.userAgent),
                ipad:          /ipad/i.test(this.userAgent),
                android:       /android/i.test(this.userAgent),
                bada:          /bada/i.test(this.userAgent),
                mobile:        /iphone|ipod|ipad|opera mini|opera mobi|iemobile/i.test(this.userAgent),
                msie_mobile:   /iemobile/i.test(this.userAgent),
                safari_mobile: /iphone|ipod|ipad/i.test(this.userAgent),
                smarttv:       /smart-?tv/i.test(this.userAgent),
                engine: {
                    version: parseFloat((this.userAgent.match(new RegExp(".+(?:(?:applewebkit|trident|presto)\/|rv:)([\\d.]+)")) || [0,'0'])[1]),
                    webkit:  /applewebkit\//i.test(this.userAgent),
                    gecko:   /gecko\//i.test(this.userAgent),
                    presto:  /presto\//i.test(this.userAgent),
                    trident: /trident\//i.test(this.userAgent)
                }
            };
        },

        getBrowserObject: function () {
            return this.browser;
        }
    };
})(jQuery);

ControllersManager.registerController('browser-detecting-controller', BrowserDetectingController);
jQuery(function () {
    ControllersManager.initController('browser-detecting-controller');
});