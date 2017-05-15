var TouchMenuController = (function ($) {
    return {
        MENU_OPEN_CLASS_NAME: 'touch-menu-open',
        TOUCH_MENU_BUTTON_CLOSE_CLASS_NAME: 'close',
        TOUCH_MENU_WIDTH: '256px',
        OPEN_ANIMATION_SPEED: 320,
        CLOSE_ANIMATION_SPEED: 250,
        ANIMATION_EASING: 'swing',

        $touchMenuButton: null,
        $touchMenuCover: null,
        $touchMenuContainer: null,
        $rootContainer: null,
        $window: null,
        $body: null,
        scrollTop: 0,
        mainNavTop: 0,
        isOpened: false,

        init: function () {
            this.$touchMenuButton = $('#touch-menu-button');
            this.$touchMenuCover = $('#touch-menu-cover');
            this.$touchMenuContainer = $('#touch-menu-container');
            this.$rootContainer = $('#container');
            this.$window = $(window);
            this.$body = $(document.body);

            this._updateTouchMenuContainerBottomOffset();
            this.$touchMenuContainer.css({width: this.TOUCH_MENU_WIDTH});
            this.$touchMenuCover.css({left: this.TOUCH_MENU_WIDTH});

            this.$touchMenuButton.click(this._touchMenuButtonHandler.bind(this));
            this.$touchMenuCover
                .on('swipeleft', this._closeTouchMenu.bind(this))
                .click(this._closeTouchMenu.bind(this));

            this.$window.resize(this._windowResizeHandler.bind(this));
        },

        _touchMenuButtonHandler: function () {
            if (!LayoutTypeController.isDesktop()) {
                if (this.$touchMenuButton.hasClass(this.TOUCH_MENU_BUTTON_CLOSE_CLASS_NAME)) {
                    this._closeTouchMenu();
                } else {
                    this._openTouchMenu();
                }
            }
        },

        _openTouchMenu: function () {
            this.isOpened = true;
            this.scrollTop = this.$window.scrollTop() || 0;
            this.$body.addClass(this.MENU_OPEN_CLASS_NAME);
            this.$rootContainer
                .css({marginTop: -1 * this.scrollTop + 'px'})
                .stop(true)
                .animate(
                    {marginLeft: this.TOUCH_MENU_WIDTH},
                    this.OPEN_ANIMATION_SPEED,
                    this.ANIMATION_EASING,
                    this._openTouchMenuCallback.bind(this)
                );
        },

        _openTouchMenuCallback: function () {
            this.$touchMenuButton.addClass(this.TOUCH_MENU_BUTTON_CLOSE_CLASS_NAME);
        },

        _closeTouchMenu: function () {
            this.$rootContainer
                .stop(true)
                .animate(
                    {marginLeft: 0},
                    this.CLOSE_ANIMATION_SPEED,
                    this.ANIMATION_EASING,
                    this._closeTouchMenuCallback.bind(this)
                );
        },

        _closeTouchMenuCallback: function () {
            this.$body.removeClass(this.MENU_OPEN_CLASS_NAME);
            this.$touchMenuButton.removeClass(this.TOUCH_MENU_BUTTON_CLOSE_CLASS_NAME);
            this.$rootContainer.css({marginTop: 0});
            this.$window.scrollTop(this.scrollTop);
            this.isOpened = false;
        },

        _closeTouchMenuImmediately: function () {
            this.$body.removeClass(this.MENU_OPEN_CLASS_NAME);
            this.$touchMenuButton.removeClass(this.TOUCH_MENU_BUTTON_CLOSE_CLASS_NAME);
            this.$rootContainer.css({marginLeft: 0, marginTop: 0});
            this.$window.scrollTop(this.scrollTop);
            this.isOpened = false;
        },

        _windowResizeHandler: function () {
            this._updateTouchMenuContainerBottomOffset();
            if (this.isOpened && LayoutTypeController.isDesktop()) {
                this._closeTouchMenuImmediately();
            }
        },

        _updateTouchMenuContainerBottomOffset: function () {
            this.$touchMenuContainer.css({
                paddingBottom: this._getWpAdminBarHeight() + 'px',
                top: this._getWpAdminBarHeight() + 'px'
            });
        },

        _getWpAdminBarHeight: function () {
            var $wpAdminBar = $('#wpadminbar');
            return $wpAdminBar.length ? $wpAdminBar.height() : 0;
        }
    };
})(jQuery);

ControllersManager.registerController('touch-menu-controller', TouchMenuController);
jQuery(function () {
    ControllersManager.initController('touch-menu-controller');
});