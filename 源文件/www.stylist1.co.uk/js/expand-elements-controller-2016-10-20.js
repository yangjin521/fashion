var ExpandElementsController = (function ($) {
    return {
        $elements: [],
        stopPropagationToDocumentRoot: false,
        $window: $(window),

        EXPANDED_CLASS_NAME: 'expanded',
        OPEN_CLASS_NAME: 'open',

        register: function (selectorId, menuId) {
            this.$elements.push({
                selector: $('#' + selectorId),
                menu: $('#' + menuId)
            });
        },

        init: function () {
            var i;
            for (i = 0; i < this.$elements.length; i++) {
                this.$elements[i].selector.click(this._toggleState.bind(this, this.$elements[i], false));
                this.$elements[i].selector.parent().click(this._toggleState.bind(this, this.$elements[i], true));
            }
            $(document).click(this._documentHandler.bind(this));
            this.$window.resize(this._closeAll.bind(this));
            this.$window.scroll(this._closeAll.bind(this));
        },

        _toggleState: function (element, isHover) {
            if ((isHover && LayoutTypeController.isDesktop()) || (!isHover && !LayoutTypeController.isDesktop())) {
                if (!isHover && !LayoutTypeController.isDesktop()) {
                    this.stopPropagationToDocumentRoot = true;
                }
                if (element.selector.hasClass(this.EXPANDED_CLASS_NAME)) {
                    this._close(element);
                } else {
                    this._open(element);
                }
            }
        },

        _open: function (element) {
            element.selector.addClass(this.EXPANDED_CLASS_NAME);
            element.menu.addClass(this.OPEN_CLASS_NAME);
        },

        _close: function (element) {
            element.selector.removeClass(this.EXPANDED_CLASS_NAME);
            element.menu.removeClass(this.OPEN_CLASS_NAME);
        },

        _documentHandler: function () {
            if (!this.stopPropagationToDocumentRoot && !LayoutTypeController.isDesktop()) {
                this._closeAll();
            }
            this.stopPropagationToDocumentRoot = false;
        },

        _closeAll: function () {
            var element,
                i;
            for (i = 0; i < this.$elements.length; i++) {
                element = this.$elements[i];
                if (element.selector.hasClass(this.EXPANDED_CLASS_NAME)) {
                    this._close(element);
                }
            }

        }
    };
})(jQuery);

ControllersManager.registerController('expand-elements-controller', ExpandElementsController);
jQuery(function () {
    ControllersManager.initController('expand-elements-controller');
});