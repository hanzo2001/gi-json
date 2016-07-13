define(["require", "exports", './GenericTreeForm'], function (require, exports, GenericTreeForm_1) {
    "use strict";
    var GenericTreeFormFactory = (function () {
        function GenericTreeFormFactory(base) {
            this.cache = {};
            this.base = base;
        }
        GenericTreeFormFactory.prototype.create = function (id) {
            var form = this.cache[id];
            if (!form) {
                form = this.cache[id] = new GenericTreeForm_1.GenericTreeForm(id, this.base);
            }
            return form;
        };
        GenericTreeFormFactory.prototype.load = function (id) {
            return this.cache[id] || null;
        };
        return GenericTreeFormFactory;
    }());
    exports.GenericTreeFormFactory = GenericTreeFormFactory;
});
