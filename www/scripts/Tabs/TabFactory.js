define(["require", "exports", "jquery", "./Tab"], function (require, exports, $, Tab_1) {
    "use strict";
    var TabFactory = (function () {
        function TabFactory(headScript, bodyScript) {
            this.ids = 0;
            this.headScript = headScript;
            this.bodyScript = bodyScript;
        }
        TabFactory.prototype.create = function (title) {
            var id = ++this.ids;
            var head = $(this.headScript({ tabId: id, tabTitle: title }));
            var body = $(this.bodyScript({ tabId: id }));
            var headElement = head[0];
            var titleElement = head.find('span')[0];
            var buttonElement = head.find('button')[0];
            var containerElement = body[0];
            var tab = new Tab_1.Tab(id, headElement, titleElement, buttonElement, containerElement);
            return tab;
        };
        return TabFactory;
    }());
    exports.TabFactory = TabFactory;
});
