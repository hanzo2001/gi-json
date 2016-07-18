var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Value", "../Utils", "../Item"], function (require, exports, Value_1, Utils_1, Item_1) {
    "use strict";
    var ArrayValue = (function (_super) {
        __extends(ArrayValue, _super);
        function ArrayValue(h, e, f) {
            _super.call(this);
            this.items = [];
            this.s = 0;
            this.f = f;
            this._init(h, e || 'a');
        }
        ArrayValue.prototype.isComplex = function () {
            return true;
        };
        ArrayValue.prototype.getItem = function (index) {
            return this.items[index] || null;
        };
        ArrayValue.prototype.getItemValue = function (index) {
            return this.items[index] ? this.items[index].v : null;
        };
        ArrayValue.prototype.addItem = function (type, offset) {
            if (offset === undefined || offset > this.s) {
                offset = this.s;
            }
            else if (offset < 0) {
                if (!this.s) {
                    offset = 0;
                }
                while (offset < 0) {
                    offset += this.s;
                }
            }
            var item = new Item_1.Item(this._h, type, this.f);
            var refItem = this.items[offset] || null;
            this.items.splice(offset, 0, item);
            if (this.isEmpty()) {
                Utils_1.clearTextNodes(this.e);
            }
            this._append(item, refItem);
            this.s++;
            return item.v;
        };
        ArrayValue.prototype.addItems = function (amount, type, offset) {
            if (offset === undefined || offset > this.s) {
                offset = this.s;
            }
            else if (offset < 0) {
                if (!this.s) {
                    offset = 0;
                }
                while (offset < 0) {
                    offset += this.s;
                }
            }
            var a = [];
            var item;
            var refItem = this.items[offset] || null;
            if (amount && this.isEmpty()) {
                Utils_1.clearTextNodes(this.e);
            }
            while (amount--) {
                item = new Item_1.Item(this._h, type, this.f);
                a.push(item.v);
                this.items.splice(offset++, 0, item);
                this._append(item, refItem);
            }
            this.s += a.length;
            return a;
        };
        ArrayValue.prototype.removeItem = function (index) {
            var item = this.items[index];
            if (item) {
                item._remove(true);
                this.items.splice(index, 1);
                this.s--;
                if (!this.s) {
                    this._defaultValue(this.e);
                }
            }
        };
        ArrayValue.prototype.empty = function () {
            var i = this.s;
            while (i--) {
                this.e.removeChild(this.items[i]._remove(true));
            }
            this.s = 0;
            this.items = [];
            this._defaultValue(this.e);
        };
        ArrayValue.prototype.first = function () {
            return this.items[0] || null;
        };
        ArrayValue.prototype.last = function () {
            return this.items[this.s - 1] || null;
        };
        ArrayValue.prototype._remove = function (unlink) {
            var i = this.s;
            while (i--) {
                this.items[i]._remove(unlink);
            }
            return _super.prototype._remove.call(this, unlink);
        };
        ArrayValue.prototype.toString = function () {
            var r = '', i = 0;
            if (this.s) {
                r += this.items[i++].v + '';
                for (; i < this.s; i++) {
                    r += ',' + this.items[i].v;
                }
            }
            return '[' + r + ']';
        };
        ArrayValue.prototype._extractValue = function (arrayElement) {
            Utils_1.clearTextNodes(arrayElement);
            Array.prototype.forEach.call(arrayElement.childNodes, function (itemElement) {
                var item = new Item_1.Item(this._h, itemElement, this.f);
                this.items.push(item);
                this.s++;
            }, this);
            return null;
        };
        return ArrayValue;
    }(Value_1.Value));
    exports.ArrayValue = ArrayValue;
});
