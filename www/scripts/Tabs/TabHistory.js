define(["require", "exports"], function (require, exports) {
    "use strict";
    var TabHistory = (function () {
        function TabHistory() {
            this._i = 0;
            this._h = Object.create(null);
            this._c = null;
            this.s = 0;
        }
        TabHistory.prototype.getCurrent = function () {
            return this._c ? this._c.d : null;
        };
        TabHistory.prototype.addEntry = function (data) {
            var i = this._i++;
            var c = this._c;
            var e = TabHistory._entryFactory(i, data);
            if (c) {
                c.n = e;
                e.p = c;
            }
            this._c = this._h[i] = e;
            this.s++;
            return i;
        };
        TabHistory.prototype.removeEntry = function (i) {
            var c = this._c;
            var e = this._h[i];
            var p = e.p;
            var n = e.n;
            if (p && n) {
                p.n = n;
                n.p = p;
            }
            else if (p) {
                p.n = null;
            }
            else if (n) {
                n.p = null;
            }
            e.p = e.n = null;
            delete this._h[i];
            this.s--;
            if (e === c) {
                this._c = c = p;
                return c ? c.d : null;
            }
            return null;
        };
        TabHistory.prototype.pushEntry = function (id) {
            var c = this._c;
            var e = this._h[id];
            var p = e.p;
            var n = e.n;
            if (e === c) {
                return c.d;
            }
            if (p && n) {
                p.n = n;
                n.p = p;
            }
            else if (p) {
                p.n = null;
            }
            else if (n) {
                n.p = null;
            }
            e.p = c;
            e.n = null;
            c.n = e;
            this._c = c = e;
            return c.d;
        };
        TabHistory._entryFactory = function (i, data) {
            var e = Object.create(null);
            e.i = i;
            e.d = data;
            e.p = null;
            e.n = null;
            return e;
        };
        return TabHistory;
    }());
    exports.TabHistory = TabHistory;
});
