var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./ProtoBase"], function (require, exports, ProtoBase_1) {
    "use strict";
    var ValueContainer = (function (_super) {
        __extends(ValueContainer, _super);
        function ValueContainer() {
            _super.apply(this, arguments);
        }
        ValueContainer.prototype.getParentValue = function () {
            return this.parent();
        };
        ValueContainer.prototype.getType = function () {
            return this.v.type;
        };
        ValueContainer.prototype.setType = function (type) {
            this.v.remove(true);
            this.v = this.f.create(this._h, type);
            this._append(this.v);
            return this.v;
        };
        ValueContainer.prototype.prev = function () {
            var e = this.e.previousElementSibling;
            var c = e ? this._h.get(e) : null;
            return c;
        };
        ValueContainer.prototype.next = function () {
            var e = this.e.nextElementSibling;
            var c = e ? this._h.get(e) : null;
            return c;
        };
        ValueContainer.prototype.first = function () {
            return this.v;
        };
        ValueContainer.prototype.last = function () {
            return this.v;
        };
        ValueContainer.prototype._remove = function (unlink) {
            var e = this.v.remove(unlink);
            this.v = null;
            return _super.prototype.remove.call(this, unlink);
        };
        return ValueContainer;
    }(ProtoBase_1.ProtoBase));
    exports.ValueContainer = ValueContainer;
});
