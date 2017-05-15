var IeAbsolutePositionFullHeightFixController = (function ($) {
    return {
        elements: [],

        init: function () {
            if (BrowserDetectingController.getBrowserObject().msie && this.elements.length) {
                $(window).resize(this._recalculateHeight.bind(this));
                this._recalculateHeight();
            }
        },

        registerElements: function (selector) {
            var $node = $(selector),
                i;
            if ($node) {
                for (i = 0; i < $node.length; i++) {
                    this.elements.push($node.eq(i));
                }
            }
        },

        _recalculateHeight: function () {
            var $node,
                i;
            for (i = 0; i < this.elements.length; i++) {
                $node = this.elements[i];
                $node.outerHeight($node.parent().outerHeight());
            }
        }
    }
})(jQuery);

ControllersManager.registerController('ie-absolute-position-full-height-fix-controller', IeAbsolutePositionFullHeightFixController);
jQuery(function () {
    ControllersManager.initController('ie-absolute-position-full-height-fix-controller');
});