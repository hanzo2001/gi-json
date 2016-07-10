define(["require", "exports"], function (require, exports) {
    "use strict";
    var TreeState = (function () {
        function TreeState(h, engine) {
            this.hash = h;
            this.engine = engine;
        }
        TreeState.prototype.factory = function (input) {
            return this.engine(this.hash, input);
        };
        TreeState.prototype.blockClicks = function () {
            this.clickEventsAllowed = false;
        };
        TreeState.prototype.allowClicks = function () {
            this.clickEventsAllowed = true;
        };
        return TreeState;
    }());
    exports.TreeState = TreeState;
});
