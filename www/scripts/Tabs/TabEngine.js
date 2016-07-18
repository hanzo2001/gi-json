define(["require", "exports", "jquery", "handlebars", "./TabHistory", "./TabFactory", "./TabManager"], function (require, exports, $, Handlebars, TabHistory_1, TabFactory_1, TabManager_1) {
    "use strict";
    var TabEngine = (function () {
        function TabEngine(manager, history, factory) {
            this.history = history;
            this.manager = manager;
            this.factory = factory;
        }
        TabEngine.prototype.closeTab = function (tab) {
            var nextTab = this.history.removeEntry(tab.hid);
            return nextTab;
        };
        TabEngine.prototype.selectTab = function (tab) {
            var selected = this.history.getCurrent();
            if (tab.hid) {
                this.history.pushEntry(tab.hid);
            }
            else {
                tab.hid = this.history.addEntry(tab);
            }
            return selected;
        };
        TabEngine.prototype.addTab = function (id) {
            var tab = this.factory.createTab(id);
            var selected = this.history.getCurrent();
            tab.hid = this.history.addEntry(tab);
            if (selected) {
                selected.deselect();
            }
            this.manager.appendTab(tab);
            return tab;
        };
        TabEngine.init = function (config) {
            var root = config.rootElement;
            var tH = root.appendChild(document.createElement('div'));
            var tC = root.appendChild(document.createElement('div'));
            var tB = tH.appendChild(document.createElement('button'));
            tB.innerHTML = '+';
            tH.setAttribute('class', 'tabHeader');
            tC.setAttribute('class', 'tabContainer');
            var scriptHeadTpl = Handlebars.templates['tabHeadTpl'];
            var scriptBodyTpl = Handlebars.templates['tabContainerTpl'];
            var factory = new TabFactory_1.TabFactory(scriptHeadTpl, scriptBodyTpl);
            var history = new TabHistory_1.TabHistory();
            var manager = new TabManager_1.TabManager(tH, tC);
            var engine = new TabEngine(manager, history, factory);
            engine.events = config.events;
            var i = 0;
            $(tB).click(engine, function (event) {
                var engine = event.data;
                var id = 'tab' + i;
                var tab = engine.addTab(id);
                engine.events.oncreate(tab);
                tab.clickClose(function (e) {
                    engine.events.onremove(tab);
                    return engine.closeTab(e.data);
                });
                tab.clickSelect(function (e) {
                    engine.events.onselect(tab);
                    return engine.selectTab(e.data);
                });
                i++;
            });
            return engine;
        };
        return TabEngine;
    }());
    exports.TabEngine = TabEngine;
});
