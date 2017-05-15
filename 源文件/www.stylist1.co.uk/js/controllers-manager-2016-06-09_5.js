var ControllersManager = (function () {
    return {
        controllers: [],

        registerController: function (name, controller) {
            if (typeof name == 'string' && controller && (controller instanceof Function || typeof controller == 'object')) {
                this.controllers.push({
                    name: name,
                    controller: controller
                });
            }
        },

        initController: function (name, args) {
            var controller = this.getController(name),
                errText;
            args = Array.isArray(args) ? args : [];
            if (controller && controller.init instanceof Function) {
                try {
                    controller.init.apply(controller, args);
                } catch (e) {
                    errText = '%s initialization error';
                    if (console.error) {
                        console.error(errText, name);
                    } else {
                        console.log('ERROR: ' + errText, name);
                    }
                }
            }
        },

        getController: function (name) {
            var controller = null,
                i;
            for (i = 0; i < this.controllers.length; i++) {
                if (this.controllers[i].name == name) {
                    controller = this.controllers[i].controller;
                }
            }
            return controller;
        }
    };
})(jQuery);