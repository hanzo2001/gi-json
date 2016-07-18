define(["require", "exports"], function (require, exports) {
    "use strict";
    var TabManager = (function () {
        function TabManager(h, c) {
            this.h = h;
            this.c = c;
            this.b = h.lastChild;
        }
        TabManager.prototype.appendTab = function (tab) {
            this.h.insertBefore(tab.head[0], this.b);
            this.c.appendChild(tab.body[0]);
        };
        TabManager.prototype.removeTab = function (tab) {
            tab.head.remove();
            tab.body.remove();
        };
        return TabManager;
    }());
    exports.TabManager = TabManager;
});
