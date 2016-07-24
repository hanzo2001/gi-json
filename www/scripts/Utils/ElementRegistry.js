define(["require", "exports"], function (require, exports) {
    "use strict";
    var ElementRegistry = (function () {
        function ElementRegistry(idGenerator, dataName) {
            this.i = idGenerator;
            this.h = Object.create(null);
            this.d = dataName;
        }
        ElementRegistry.prototype.isRegistered = function (e) {
            var id = ~~e.dataset[this.d] || 0;
            return id && !!this.h[id];
        };
        ElementRegistry.prototype.get = function (e) {
            var id = ~~e.dataset[this.d];
            return this.h[id] || null;
        };
        ElementRegistry.prototype.register = function (value) {
            var id = this.i();
            this.h[id] = value;
            value.e.dataset[this.d] = id + '';
            return id;
        };
        ElementRegistry.prototype.unregister = function (e) {
            var id = ~~e.dataset[this.d] || 0;
            if (id && this.h[id]) {
                delete this.h[id];
                delete e.dataset[this.d];
            }
            return e;
        };
        return ElementRegistry;
    }());
    exports.ElementRegistry = ElementRegistry;
});
