define(["require", "exports"], function (require, exports) {
    "use strict";
    var ProtoBase = (function () {
        function ProtoBase() {
        }
        ProtoBase.prototype.parent = function () {
            return this._h.get(this.e.parentElement);
        };
        ProtoBase.prototype.getNodeId = function () {
            return this.id;
        };
        ProtoBase.prototype.remove = function (unlink) {
            var e = this.e;
            this.e = null;
            if (unlink) {
                e.parentNode.removeChild(e);
                this._h.unregister(e);
                this._h = null;
            }
            return e;
        };
        ProtoBase.prototype._init = function (h, input) {
            this._h = h;
            if (input instanceof HTMLElement) {
                this.e = input;
            }
            else {
                this.e = document.createElement(input);
            }
            this.id = this._h.register(this);
            return this.e;
        };
        ProtoBase.prototype._append = function (c, b) {
            this.e.insertBefore(c.e, b ? b.e : null);
        };
        return ProtoBase;
    }());
    exports.ProtoBase = ProtoBase;
});
