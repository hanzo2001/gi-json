define(["require", "exports", "jquery"], function (require, exports, $) {
    "use strict";
    var Tab = (function () {
        function Tab(id, head, title, button, body) {
            this.id = id;
            this.head = head;
            this.body = body;
            this.title = title;
            this.button = button;
        }
        Tab.prototype.renameTab = function (title) {
            this.title.innerHTML = title;
        };
        Tab.prototype.blurTab = function () {
            $(this.head).addClass('hidden');
            $(this.body).addClass('hidden');
        };
        Tab.prototype.focusTab = function () {
            $(this.head).removeClass('hidden');
            $(this.body).removeClass('hidden');
        };
        Tab.prototype.closeTab = function () {
            $(this.head).remove();
            $(this.body).remove();
            this.head = this.body = this.title = this.button = null;
            this.state = null;
        };
        Tab.prototype.getTitle = function () {
            return this.title.innerHTML;
        };
        return Tab;
    }());
    exports.Tab = Tab;
});
