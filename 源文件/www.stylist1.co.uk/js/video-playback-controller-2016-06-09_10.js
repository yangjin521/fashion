var VideoPlaybackController = (function ($) {
    return {
        VIDEO_HASH_REG_EXP: /^!\/video\/([a-zA-Z0-9\-_]+)$/,

        init: function () {
            HashController.addListener(this.VIDEO_HASH_REG_EXP, this._hashListenerCallback.bind(this));
        },

        _hashListenerCallback: function() {
            var hash = HashController.getHash(),
                hashMatch = (this.VIDEO_HASH_REG_EXP).exec(hash),
                videoId = hashMatch ? hashMatch[1] : false,
                popup;
            if (videoId) {
                popup = new VideoPlaybackPopupController(videoId);
                popup.open();
            } else {
                HashController.clearHash();
            }
        }
    };
})(jQuery);

ControllersManager.registerController('video-playback-controller', VideoPlaybackController);
jQuery(function () {
    ControllersManager.initController('video-playback-controller');
});