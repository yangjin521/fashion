var VideoPlaybackPopupController = (function ($) {
    function VideoPlaybackPopupController(videoId) {
        this.videoId = videoId;
        this.$targetContent = null;
        this.targetContentData = null;
        this.$popupContainer = null;
        this.isOpened = false;
        this._init.apply(this);
    }

    VideoPlaybackPopupController.FADE_ANIMATION_SPEED = 500;

    VideoPlaybackPopupController.prototype.open = function () {
        if (!this.isOpened) {
            $(document.body).addClass('no-body-scroll');
            this.$popupContainer = $('<div class="video-playback-popup-container">');
            this._fillPopupContainer();
            $('#container').append(this.$popupContainer);
            this.$popupContainer.fadeIn(VideoPlaybackPopupController.FADE_ANIMATION_SPEED);
            this.isOpened = true;
            // load video automatically after appended
            $(':not(.owl-item.cloned) #' + this.videoId + ' .play-video-click-zone').click();
        }
    };

    VideoPlaybackPopupController.prototype.close = function () {
        if (this.isOpened) {
            this.isOpened = false;
            $(document.body).removeClass('no-body-scroll');
            this.$popupContainer.fadeOut(
                VideoPlaybackPopupController.FADE_ANIMATION_SPEED,
                'swing',
                this._closeFadeOutCallback.bind(this)
            );
            HashController.clearHash();
        }
    };

    VideoPlaybackPopupController.prototype._init = function () {
        this.$targetContent = $('.owl-item:not(.cloned) [data-video-id=' + this.videoId + ']');
        if (!this.$targetContent.length) {
            this.$targetContent = $('[data-video-id=' + this.videoId + ']');
        }
        if (this.$targetContent.length) {
            this.$targetContent.addClass('video-playback-popup-target-content');
        } else {
            HashController.clearHash();
        }
    };

    VideoPlaybackPopupController.prototype._fillPopupContainer = function () {
        var $cover = $('<div class="video-playback-popup-cover">'),
            $content = $('<div class="video-playback-popup-content">'),
            $closeBtn = $('<div class="video-playback-popup-close-btn">');
        $cover.click(this.close.bind(this));
        $closeBtn.click(this.close.bind(this));
        this.targetContentData = {
            $parent: this.$targetContent.parent(),
            index: this.$targetContent.index()
        };
        $content
            .append($closeBtn)
            .append(this.$targetContent);
        this.$popupContainer
            .append($cover)
            .append($content);
    };

    VideoPlaybackPopupController.prototype._closeFadeOutCallback = function () {
        this._moveTargetContentBack();
        this.$popupContainer.remove();
        this.$popupContainer = null;
    };

    VideoPlaybackPopupController.prototype._moveTargetContentBack = function () {
        var $parent,
            index;
        if (this.targetContentData) {
            $parent = this.targetContentData.$parent;
            index = this.targetContentData.index;
            if (index == 0) {
                $parent.prepend(this.$targetContent);
            } else if (index >= $parent.children().length) {
                $parent.append(this.$targetContent);
            } else {
                $parent.children().eq(index - 1).after(this.$targetContent);
            }
        }
        this.targetContentData = null;
    };

    return VideoPlaybackPopupController;
})(jQuery);

ControllersManager.registerController('video-playback-popup-controller', VideoPlaybackPopupController);