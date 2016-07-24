var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Value"], function (require, exports, Value_1) {
    "use strict";
    var ComplexValue = (function (_super) {
        __extends(ComplexValue, _super);
        function ComplexValue() {
            _super.apply(this, arguments);
        }
        ComplexValue.prototype.isComplex = function () {
            return true;
        };
        ComplexValue.prototype.first = function () {
            return null;
        };
        ComplexValue.prototype.last = function () {
            return null;
        };
        ComplexValue.prototype.empty = function () { };
        return ComplexValue;
    }(Value_1.Value));
    exports.ComplexValue = ComplexValue;
});
