define(["require", "exports"], function (require, exports) {
    "use strict";
    var Tab = (function () {
        function Tab(head, body) {
            this.hid = null;
            this.head = head;
            this.body = body;
            this.active = false;
        }
        Tab.prototype.clickSelect = function (fn) {
            this.head.find('span').click(this, function (e) {
                var tab = e.data;
                if (!tab.active) {
                    var selected = fn(e);
                    selected && selected.deselect();
                    tab.select();
                }
            });
        };
        Tab.prototype.clickClose = function (fn) {
            this.head.find('button').click(this, function (e) {
                var tab = e.data;
                var nextTab = fn(e);
                nextTab && nextTab.select();
                tab && tab.remove();
            });
        };
        Tab.prototype.remove = function () {
            if (this.head) {
                this.head.remove();
                this.body.remove();
                this.head = this.body = null;
            }
            this.active = false;
        };
        Tab.prototype.select = function () {
            if (this.head) {
                this.head.removeClass('hidden');
                this.body.removeClass('hidden');
            }
            this.active = true;
        };
        Tab.prototype.deselect = function () {
            this.head.addClass('hidden');
            this.body.addClass('hidden');
            this.active = false;
        };
        return Tab;
    }());
    exports.Tab = Tab;
});
