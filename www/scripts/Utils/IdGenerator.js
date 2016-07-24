define(["require", "exports"], function (require, exports) {
    "use strict";
    var IdGeneratorFactory = (function () {
        function IdGeneratorFactory() {
        }
        IdGeneratorFactory.prototype.create = function () {
            var id = 0;
            return function () { return ++id; };
        };
        return IdGeneratorFactory;
    }());
    exports.IdGeneratorFactory = IdGeneratorFactory;
});
