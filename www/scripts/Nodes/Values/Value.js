var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../ProtoBase"], function (require, exports, ProtoBase_1) {
    "use strict";
    var Value = (function (_super) {
        __extends(Value, _super);
        function Value() {
            _super.apply(this, arguments);
        }
        Value.prototype.isNotRoot = function () {
            var tag = this.e.parentElement ? this.e.parentElement.tagName : null;
            return tag === 'ITEM' || tag === 'MEMBER';
        };
        Value.prototype.getParentContainer = function () {
            return this.isNotRoot() ? _super.prototype.parent.call(this) : null;
        };
        Value.prototype.parent = function () {
            return this.isNotRoot() ? _super.prototype.parent.call(this) : null;
        };
        Value.prototype.prev = function () {
            return this._getSibling(false);
        };
        Value.prototype.next = function () {
            return this._getSibling(true);
        };
        Value.prototype.isEmpty = function () {
            return this.e.innerHTML === '&nbsp;';
        };
        Value.prototype.isEditable = function () {
            return false;
        };
        Value.prototype.isComplex = function () {
            return false;
        };
        Value.prototype.getValue = function () {
            return this.value;
        };
        Value.prototype.getDisplayValue = function () {
            return '';
        };
        Value.prototype.setValue = function (value) { };
        Value.prototype.resetValue = function () {
            this._defaultValue(this.e);
            return this.e;
        };
        Value.prototype._getSibling = function (next) {
            var container = this.e.parentElement || null;
            if (!this.isNotRoot()) {
                return null;
            }
            var sibling = container[next ? 'nextSibling' : 'previousSibling'] || null;
            if (!sibling) {
                return null;
            }
            var value = sibling.lastChild || null;
            return value ? this._h.get(value) : null;
        };
        Value.prototype._init = function (h, input) {
            var e;
            var type;
            if (input instanceof HTMLElement) {
                e = _super.prototype._init.call(this, h, input);
                this.type = e.dataset['t'];
                this.value = this._extractValue(e);
            }
            else {
                e = _super.prototype._init.call(this, h, 'value');
                e.dataset['t'] = input;
                this.type = input;
                this.value = this._defaultValue(e);
            }
            return e;
        };
        Value.prototype._defaultValue = function (e) {
            e.innerHTML = '&nbsp;';
            return null;
        };
        Value.prototype._extractValue = function (e) {
            return null;
        };
        return Value;
    }(ProtoBase_1.ProtoBase));
    exports.Value = Value;
});
