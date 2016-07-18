var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Value", "../Utils"], function (require, exports, Value_1, Utils_1) {
    "use strict";
    var NumberValue = (function (_super) {
        __extends(NumberValue, _super);
        function NumberValue(h, e) {
            _super.call(this);
            this._init(h, e || 'n');
        }
        NumberValue.prototype.getDisplayValue = function () {
            return this.e.innerHTML;
        };
        NumberValue.prototype.setValue = function (input) {
            this.value = Utils_1.ElementParser.parseNumber(input);
            if (isNaN(this.value)) {
                this.value = this._defaultValue(this.e);
            }
            else {
                this.e.innerHTML = input;
            }
        };
        NumberValue.prototype.isEditable = function () {
            return true;
        };
        NumberValue.prototype.toString = function () {
            return this.e.innerHTML;
        };
        NumberValue.prototype._defaultValue = function (e) {
            e.innerHTML = '0';
            return 0;
        };
        NumberValue.prototype._extractValue = function (e) {
            var value = Utils_1.ElementParser.parseNumber(e.innerHTML);
            if (isNaN(value)) {
                return this._defaultValue(e);
            }
            return value;
        };
        return NumberValue;
    }(Value_1.Value));
    exports.NumberValue = NumberValue;
});
