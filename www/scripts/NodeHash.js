define(["require", "exports"], function (require, exports) {
    "use strict";
    var NodeHash = (function () {
        function NodeHash() {
            this.i = 0;
            this.h = {};
        }
        NodeHash.prototype.isRegistered = function (e) {
            var id = ~~e.dataset['nid'] || 0;
            return id && !!this.h[id];
        };
        NodeHash.prototype.getNode = function (e) {
            var id = ~~e.dataset['nid'];
            return this.h[id] || null;
        };
        NodeHash.prototype.register = function (value) {
            var id = ++this.i;
            this.h[id] = value;
            value.e.dataset['nid'] = id + '';
            return id;
        };
        NodeHash.prototype.unregister = function (e) {
            var id = ~~e.dataset['nid'] || 0;
            if (id && this.h[id]) {
                delete this.h[id];
                delete e.dataset['nid'];
            }
            return e;
        };
        return NodeHash;
    }());
    exports.NodeHash = NodeHash;
});
