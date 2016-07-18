var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Value", "../Utils"], function (require, exports, Value_1, Utils_1) {
    "use strict";
    var StringValue = (function (_super) {
        __extends(StringValue, _super);
        function StringValue(h, e) {
            _super.call(this);
            this._init(h, e || 's');
        }
        StringValue.prototype.isEditable = function () {
            return true;
        };
        StringValue.prototype.getDisplayValue = function () {
            return this.e.innerHTML === '&nbsp;' ? '' : this.e.innerHTML;
        };
        StringValue.prototype.setValue = function (value) {
            if (value === '') {
                this.value = this._defaultValue(this.e);
            }
            else {
                this.e.innerHTML = Utils_1.ElementParser.str2html(value);
                this.value = value;
            }
        };
        StringValue.prototype.toString = function () {
            var value = Utils_1.ElementParser.str2json(this.value);
            return '"' + value + '"';
        };
        StringValue.prototype._defaultValue = function (e) {
            e.innerHTML = '&nbsp;';
            return '';
        };
        StringValue.prototype._extractValue = function (e) {
            var value = e.innerHTML;
            if (value === '') {
                this.e.innerHTML = '&nbsp;';
            }
            return value === '&nbsp;' ? '' : Utils_1.ElementParser.html2str(value);
        };
        return StringValue;
    }(Value_1.Value));
    exports.StringValue = StringValue;
});
