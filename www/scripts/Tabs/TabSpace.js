define(["require", "exports"], function (require, exports) {
    "use strict";
    var TabSpace = (function () {
        function TabSpace(hE, bE, cE) {
            this.header = hE;
            this.button = bE;
            this.container = cE;
        }
        TabSpace.prototype.addTab = function (tab) {
            this.header.insertBefore(tab.head, this.button);
            this.container.appendChild(tab.body);
            return tab;
        };
        return TabSpace;
    }());
    exports.TabSpace = TabSpace;
});
