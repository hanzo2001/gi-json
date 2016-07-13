define(["require", "exports"], function (require, exports) {
    "use strict";
    var no = function () { return Object.create(null); };
    var ex = function (b, o) { for (var i in o) {
        b[i] = o[i];
    } return b; };
    exports.primitiveTypes = ex(no(), {
        u: 'null',
        s: 'string',
        b: 'bool',
        n: 'number',
    });
    exports.complexTypes = ex(no(), {
        a: 'array',
        o: 'object'
    });
    exports.valueTypes = ex(ex(no(), exports.primitiveTypes), exports.complexTypes);
    no = ex = null;
});
