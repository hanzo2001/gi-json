define(["require", "exports", "jquery", "./Tab"], function (require, exports, $, Tab_1) {
    "use strict";
    var TabFactory = (function () {
        function TabFactory(headScript, bodyScript) {
            this.headScript = headScript;
            this.bodyScript = bodyScript;
        }
        TabFactory.prototype.createTab = function (id) {
            return new Tab_1.Tab($(this.headScript({ tabName: id })), $(this.bodyScript({ tabName: id })));
        };
        return TabFactory;
    }());
    exports.TabFactory = TabFactory;
});
