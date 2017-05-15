var CustomSelectMenuController = (function ($) {
    return {
        TARGET_SELECT_CLASS_NAME: 'use-custom-select-menu-controller',
        SELECTED_DROP_DOWN_ITEM_CLASS_NAME: 'ui-state-selected',

        $selects: null,

        init: function () {
            var i;
            this.$selects = $('.' + this.TARGET_SELECT_CLASS_NAME);
            for (i = 0; i< this.$selects.length; i++) {
                this.bindSelect(this.$selects.eq(i));
            }
            $(window)
                .scroll(this._closeAllCustomSelects.bind(this))
                .resize(this._closeAllCustomSelects.bind(this));
        },

        bindSelect: function ($node) {
            if ($node && $.inArray($node.get(0), this.$selects) == -1) {
                this.$selects.push($node.get(0));
            }
            $node.selectmenu({
                create: this._createHandler.bind(this, $node),
                open: this._openHandler.bind(this, $node),
                select: this._selectHandler.bind(this, $node)
            });
        },

        unbindSelect: function ($node) {
            var index = Array.prototype.indexOf.call(this.$selects, $node.get(0));
            if (index != -1) {
                this.$selects.splice(index, 1);
            }
            $node.selectmenu('destroy');
        },

        _createHandler: function ($node) {
            $node.selectmenu('widget').blur(this._closeCustomSelect.bind(this, $node));
        },

        _closeCustomSelect: function ($node) {
            $node.selectmenu('close');
        },

        _closeAllCustomSelects: function () {
            var i;
            for (i = 0; i < this.$selects.length; i++) {
                this._closeCustomSelect(this.$selects.eq(i));
            }
        },

        _openHandler: function ($node) {
            var $menuWidget = $node.selectmenu('menuWidget');
            var $widget = $node.selectmenu('widget');
            $menuWidget.children().removeClass(this.SELECTED_DROP_DOWN_ITEM_CLASS_NAME);
            $menuWidget.find('.ui-state-focus').addClass(this.SELECTED_DROP_DOWN_ITEM_CLASS_NAME);
            $menuWidget.css({width: $widget.width()})
        },

        _selectHandler: function ($node, event, selectedOption) {
            $node.find('option').removeAttr('selected');
            $node.find('option[value="' + selectedOption.item.value + '"]').attr('selected', 'selected');
            $node.change();
        }
    };
})(jQuery);

ControllersManager.registerController('custom-select-menu-controller', CustomSelectMenuController);
jQuery(function () {
    ControllersManager.initController('custom-select-menu-controller');
});