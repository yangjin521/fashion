var HashController = (function ($) {
    return {
        /** @type []{hash: string|RegExp, callback: Function} */
        listeners: [],
        prevHash: '',
        backEndObject: backEndObject,

        init: function () {
            this._checkHash();
            $(window).on('hashchange', this._checkHash.bind(this));
        },

        addListener: function (hash, callback) {
            if ((typeof hash == 'string' || hash instanceof RegExp) && callback instanceof Function) {
                this.listeners.push({hash: hash, callback: callback});
            }
        },

        getHash: function () {
            var hash = window.location.hash,
                regExp,
                match;
            if (BrowserDetectingController.getBrowserObject().msie) {
                regExp = /[^\#]*(\#.*)$/i;
                match = regExp.exec(window.location.href);
                hash = match ? match[1] : '';
            }
            return hash.substr(1, hash.length);
        },

        setHash: function (newHash) {
            var hash = this.getHash(),
                href;
            if (newHash != hash) {
                if (BrowserDetectingController.getBrowserObject().msie) {
                    href = this.backEndObject ? this.backEndObject.baseUrl : '';
                    href += '#' + newHash;
                    window.location.href = href;
                } else {
                    window.location.hash = newHash;
                }
            }
        },

        clearHash: function () {
            if (this.getHash()) {
                var $window = $(window),
                    scrollTop = $window.scrollTop();
                this.setHash('');
                $window.scrollTop(scrollTop);
            }
        },

        getPrevHash: function () {
            return this.prevHash;
        },

        _checkHash: function () {
            var currentHash = this.getHash(),
                listener,
                hash,
                i;
            for (i = 0; i < this.listeners.length; i++) {
                listener = this.listeners[i];
                hash = listener.hash;
                if ((typeof hash == 'string' && hash == currentHash) ||
                    (hash instanceof RegExp && hash.test(currentHash))) {
                    listener.callback();
                }
            }
            this.prevHash = currentHash;
        }
    };
})(jQuery);

ControllersManager.registerController('hash-controller', HashController);