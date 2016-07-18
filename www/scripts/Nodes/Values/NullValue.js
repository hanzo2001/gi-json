var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Value"], function (require, exports, Value_1) {
    "use strict";
    var NullValue = (function (_super) {
        __extends(NullValue, _super);
        function NullValue(h, e) {
            _super.call(this);
            this._init(h, e || 'u');
        }
        NullValue.prototype.toString = function () {
            return 'null';
        };
        return NullValue;
    }(Value_1.Value));
    exports.NullValue = NullValue;
});
