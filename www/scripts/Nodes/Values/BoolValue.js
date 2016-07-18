var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Value", "../Utils"], function (require, exports, Value_1, Utils_1) {
    "use strict";
    var BoolValue = (function (_super) {
        __extends(BoolValue, _super);
        function BoolValue(h, e) {
            _super.call(this);
            this._init(h, e || 'b');
        }
        BoolValue.prototype.getDisplayValue = function () {
            return this.e.innerHTML;
        };
        BoolValue.prototype.setValue = function (input) {
            if (typeof (input) === 'string') {
                this.value = Utils_1.ElementParser.parseBool(input);
            }
            else {
                this.value = !!input;
            }
            this.e.innerHTML = this.value ? 'true' : 'false';
        };
        BoolValue.prototype.toString = function () {
            return this.e.innerHTML;
        };
        BoolValue.prototype._defaultValue = function (e) {
            e.innerHTML = 'false';
            return false;
        };
        BoolValue.prototype._extractValue = function (e) {
            var value = Utils_1.ElementParser.parseBool(e.innerHTML);
            e.innerHTML = value ? 'true' : 'false';
            return value;
        };
        return BoolValue;
    }(Value_1.Value));
    exports.BoolValue = BoolValue;
});
