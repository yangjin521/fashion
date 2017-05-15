var MenuUrlParamsController = (function ($) {
    return {
        CURRENT_MENU_ITEM_CLASS_NAME: 'current-menu-item',
        PARAM_LINK_ADDRESS_REG_EXP: /\?[a-z0-9\-\_\.\~\!\*\'\(\)\;\:\@\&\=\+\$\,\/\#\[\]\%]*/i,

        $mainNav: null,

        init: function () {
            this.$mainNav = $('#main-nav');
            this._initSubMenuParamsUrl(this.$mainNav.find('li.current-menu-item>ul.sub-menu>li'));
        },

        _initSubMenuParamsUrl: function ($subMenuItems) {
            var urlParams = window.location.search,
                isFoundActive = false,
                $item,
                href,
                i;
            for (i = 0; i < $subMenuItems.length; i++) {
                $item = $subMenuItems.eq(i);
                href = $item.find('a').attr('href');
                if (this.PARAM_LINK_ADDRESS_REG_EXP.test(href) && urlParams.indexOf(href) != -1) {
                    $item.addClass(this.CURRENT_MENU_ITEM_CLASS_NAME);
                    isFoundActive = true;
                    break;
                }
            }
            if (!isFoundActive && $subMenuItems.length && this.PARAM_LINK_ADDRESS_REG_EXP.test($subMenuItems.eq(0).find('a').attr('href'))) {
                $subMenuItems.eq(0).addClass(this.CURRENT_MENU_ITEM_CLASS_NAME);
            }
        }
    };
})(jQuery);

ControllersManager.registerController('menu-url-params-controller', MenuUrlParamsController);
jQuery(function () {
    ControllersManager.initController('menu-url-params-controller');
});