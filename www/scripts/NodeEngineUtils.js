define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.isFloatRE = /^-?(0|[1-9]\d*)(((\.\d+)|([eE]-?\d+))|(\.\d+[eE]-?\d+))$/;
    exports.isIntRE = /^-?(0|[1-9]\d*)$/;
    var ElementParser = (function () {
        function ElementParser() {
        }
        ElementParser.parseBool = function (v) {
            if (v === 'false') {
                return false;
            }
            if (v === 'true') {
                return true;
            }
            return !!v;
        };
        ElementParser.parseNumber = function (v) {
            if (exports.isFloatRE.test(v)) {
                return parseFloat(v);
            }
            if (exports.isIntRE.test(v)) {
                return parseInt(v);
            }
            return NaN;
        };
        return ElementParser;
    }());
    exports.ElementParser = ElementParser;
    function clearTextNodes(e) {
        var c = e.firstChild;
        var n;
        while (c) {
            n = c.nextSibling;
            if (!(c instanceof HTMLElement)) {
                e.removeChild(c);
            }
            c = n;
        }
        return e;
    }
    exports.clearTextNodes = clearTextNodes;
    function nullO(debug) {
        return Object.create(debug ? { hasOwnPropery: Object.prototype.hasOwnProperty } : null);
    }
    exports.nullO = nullO;
});
