var EmbedVideo = (function ($) {
    function EmbedVideo(mediaContainerId, embedCode) {
        this.stopPropagationFlag = false;
        this.video = null;
        this._init(mediaContainerId || '', embedCode || '');
    }

    EmbedVideo.FADE_ANIMATION_SPEED = 300;
    EmbedVideo.YOUTUBE_ADD_AUTOPLAY_IFRAME_CHECK = /\s*<iframe[^>]*src="([^"]+)"/i; // get iframe href attribute
    EmbedVideo.YOUTUBE_ADD_AUTOPLAY_LINK_DOMAIN_CHECK = /^http[s]:\/\/(?:www\.)?youtube\.com\/embed/;
    EmbedVideo.YOUTUBE_ADD_AUTOPLAY_LINK_CHECK = /^[^\?]+(\?)/i; // check for parameters existence
    EmbedVideo.YOUTUBE_ADD_AUTOPLAY_PARAM = 'autoplay=1';

    EmbedVideo.prototype._init = function (mediaContainerId, embedCode) {
        var $mediaContainer = $('#' + mediaContainerId),
            $videoContainer = $mediaContainer.find('.video-container').first(),
            $imageContainer = $mediaContainer.find('.image-container').first(),
            $playVideoZone = $mediaContainer.find('.play-video-click-zone').first();
        $(document).click(this._documentClickHandler.bind(this));
        $mediaContainer.click(this._mediaContainerClickHandler.bind(this));
        $playVideoZone.click(this._playVideo.bind(this));
        this.video = {
            $mediaContainer: $mediaContainer,
            $videoContainer: $videoContainer,
            $imageContainer: $imageContainer,
            $playVideoZone: $playVideoZone,
            embedCode: this._addAutoPlayForYouTubeVideo(embedCode),
            isPlaying: true
        };
    };

    EmbedVideo.prototype._addAutoPlayForYouTubeVideo = function (embedCode) {
        var iframeMatch = EmbedVideo.YOUTUBE_ADD_AUTOPLAY_IFRAME_CHECK.exec(embedCode),
            link = iframeMatch ? iframeMatch[1] : '',
            paramPrefix = '',
            oldLinkLength,
            srcStartPos,
            linkMatch;
        if (link && EmbedVideo.YOUTUBE_ADD_AUTOPLAY_LINK_DOMAIN_CHECK.test(link)) {
            linkMatch = EmbedVideo.YOUTUBE_ADD_AUTOPLAY_LINK_CHECK.test(link);
            paramPrefix = linkMatch ? '&' : '?';
            srcStartPos = embedCode.indexOf(link);
            oldLinkLength = link.length;
            link += paramPrefix + EmbedVideo.YOUTUBE_ADD_AUTOPLAY_PARAM;
            embedCode = embedCode.substring(0, srcStartPos) + link + embedCode.substring(srcStartPos + oldLinkLength);
        }
        return embedCode;
    };

    EmbedVideo.prototype._playVideo = function () {
        this.video.isPlaying = true;
        this.video.$videoContainer.html(this.video.embedCode);
        $([this.video.$imageContainer.get(0), this.video.$playVideoZone.get(0)])
            .stop(true, true)
            .fadeOut(this.FADE_ANIMATION_SPEED);
    };

    EmbedVideo.prototype._closeVideo = function () {
        if (this.video.isPlaying) {
            $([this.video.$imageContainer.get(0), this.video.$playVideoZone.get(0)])
                .stop(true, true)
                .fadeIn(this.FADE_ANIMATION_SPEED, this._closeVideoFadeInCallback.bind(this));
        }
    };

    EmbedVideo.prototype._closeVideoFadeInCallback = function () {
        this.video.$videoContainer.html('');
        this.video.isPlaying = false;
    };

    EmbedVideo.prototype._mediaContainerClickHandler = function () {
        this.stopPropagationFlag = true;
    };

    EmbedVideo.prototype._documentClickHandler = function () {
        if (!this.stopPropagationFlag) {
            this._closeVideo();
        }
        this.stopPropagationFlag = false;
    };

    return EmbedVideo;
})(jQuery);

ControllersManager.registerController('embed-video-controller', EmbedVideo);