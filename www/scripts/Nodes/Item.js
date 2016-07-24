var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./ValueContainer"], function (require, exports, ValueContainer_1) {
    "use strict";
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item(h, input, f) {
            _super.call(this);
            this.f = f;
            this._init(h, input);
        }
        Item.prototype.getIndex = function () {
            var i = 0;
            var c = this.e;
            while ((c = c.previousElementSibling) != null) {
                i++;
            }
            return i;
        };
        Item.prototype._init = function (h, input) {
            var e;
            if (input instanceof HTMLElement) {
                e = _super.prototype._init.call(this, h, input);
                this.v = this.f.create(this._h, e.firstChild);
            }
            else {
                e = _super.prototype._init.call(this, h, 'item');
                this.v = this.f.create(this._h, input);
                this._append(this.v);
            }
            return e;
        };
        return Item;
    }(ValueContainer_1.ValueContainer));
    exports.Item = Item;
});
