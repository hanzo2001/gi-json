define(["require", "exports"], function (require, exports) {
    "use strict";
    var NodeEngine = (function () {
        function NodeEngine(hash, factory) {
            this.hash = hash;
            this.factory = factory;
            this.root = null;
        }
        NodeEngine.prototype.createValue = function (input) {
            var v = this.factory.create(this.hash, input);
            if (!this.root) {
                this.root = v;
            }
            return v;
        };
        NodeEngine.prototype.getNode = function (e) {
            return this.hash.get(e);
        };
        NodeEngine.prototype.empty = function () {
            this.root && this.root.remove(true);
            this.root = null;
        };
        return NodeEngine;
    }());
    exports.NodeEngine = NodeEngine;
});
