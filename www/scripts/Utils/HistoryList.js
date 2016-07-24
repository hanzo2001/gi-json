define(["require", "exports"], function (require, exports) {
    "use strict";
    var HistoryList = (function () {
        function HistoryList() {
            this.h = Object.create(null);
            this.c = null;
            this.s = 0;
        }
        HistoryList.prototype.current = function () {
            return this.c ? this.c.d : null;
        };
        HistoryList.prototype.at = function (index) {
            if (!this.s || index >= this.s) {
                return null;
            }
            if (!index) {
                return this.c.d;
            }
            if (index < 0) {
                while (index < 0) {
                    index += this.s;
                }
            }
            var e = this.c;
            while (index--) {
                e = this.c.p;
            }
            return e.d;
        };
        HistoryList.prototype.add = function (d) {
            var e = this.entry(d);
            var p = this.c;
            e.p = p;
            if (p) {
                p.n = e;
            }
            this.h[e.i] = e;
            this.c = e;
            this.s++;
            return d;
        };
        HistoryList.prototype.push = function (d) {
            var e = this.h[d.id] || null;
            if (!e) {
                return null;
            }
            var c = this.c;
            if (e === c) {
                return c.d;
            }
            var p = e.p;
            var n = e.n;
            if (p && n) {
                p.n = n;
                n.p = p;
            }
            else if (n) {
                n.p = p;
            }
            c.n = e;
            e.p = c;
            this.c = c = e;
            return c.d;
        };
        HistoryList.prototype.remove = function (d) {
            var e = this.h[d.id] || null;
            if (!e) {
                return null;
            }
            var c = this.c;
            var p = e.p;
            var n = e.n;
            e.p = e.n = null;
            delete this.h[e.i];
            if (p && n) {
                p.n = n;
                n.p = p;
            }
            else if (p) {
                p.n = n;
            }
            else if (n) {
                n.p = p;
            }
            if (e === c) {
                this.c = c = p;
            }
            this.s--;
            return c ? c.d : null;
        };
        HistoryList.prototype.entry = function (d) {
            var e = Object.create(null);
            e.i = d.id;
            e.d = d;
            e.p = e.n = null;
            return e;
        };
        return HistoryList;
    }());
    exports.HistoryList = HistoryList;
});
