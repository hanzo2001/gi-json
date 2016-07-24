define(["require", "exports"], function (require, exports) {
    "use strict";
    var TreeNavigator = (function () {
        function TreeNavigator(switchCb) {
            this.switchCb = switchCb;
            this.node = null;
        }
        TreeNavigator.prototype.clear = function () {
            this.node = null;
        };
        TreeNavigator.prototype.select = function (node) {
            var last = this.node;
            var next = node;
            next && (this.node = this.switchCb(next, last, 'select'));
        };
        TreeNavigator.prototype.parent = function () {
            var last = this.node;
            var next = last.parent ? last.parent() : null;
            next && (this.node = this.switchCb(next, last, 'parent'));
        };
        TreeNavigator.prototype.next = function () {
            var last = this.node;
            var next = last.next ? last.next() : null;
            next && (this.node = this.switchCb(next, last, 'next'));
        };
        TreeNavigator.prototype.prev = function () {
            var last = this.node;
            var next = last.prev ? last.prev() : null;
            next && (this.node = this.switchCb(next, last, 'prev'));
        };
        TreeNavigator.prototype.first = function () {
            var last = this.node;
            var next = last.first ? last.first() : null;
            next && (this.node = this.switchCb(next, last, 'first'));
        };
        TreeNavigator.prototype.last = function () {
            var last = this.node;
            var next = last.last ? last.last() : null;
            next && (this.node = this.switchCb(next, last, 'last'));
        };
        TreeNavigator.prototype.child = function (accessor) {
            var last = this.node;
            var next = last.child ? last.child(accessor) : null;
            next && (this.node = this.switchCb(next, last, 'child'));
        };
        return TreeNavigator;
    }());
    exports.TreeNavigator = TreeNavigator;
});
