define(["require", "exports", "./ElementClickEvents", "../Forms/GenericTreeForm", "../Forms/Actions/StartTreeForm"], function (require, exports, ElementClickEvents_1, GenericTreeForm_1, StartTreeForm_1) {
    "use strict";
    var TreeState = (function () {
        function TreeState(o) {
            var _this = this;
            this.tab = o.tab;
            o.tab.state = this;
            this.engine = o.engine;
            this.history = o.history;
            this.navigator = o.navigator;
            this.kbsRegister = o.kbsRegister;
            this.serialize = o.serialize || function () { };
            this.active = false;
            this.navigating = false;
            var nextTab = this.history.current();
            if (nextTab) {
                nextTab.state.unfocus();
            }
            this.history.add(this.tab);
            $(this.tab.title).click(function (e) { return _this.focus(); });
            $(this.tab.button).click(function (e) { return _this.teardown(); });
            var kc = {
                w: 87,
                a: 65,
                s: 83,
                d: 68,
                _: 32,
            };
            this.kbsRegister.register(kc.w, function (e) { return _this.navigator.prev(); });
            this.kbsRegister.register(kc.a, function (e) { return _this.navigator.parent(); });
            this.kbsRegister.register(kc.s, function (e) { return _this.navigator.next(); });
            this.kbsRegister.register(kc.d, function (e) { return _this.navigator.first(); });
            this.kbsRegister.register(kc._, function (e) { return $(_this.navigator.node.e).click(); });
            this.navigationEvents = this.kbsRegister.clear();
            this.root = this.tab.body;
            this.treeBase = this.root.appendChild(document.createElement('div'));
            this.formBase = this.root.appendChild(document.createElement('div'));
            this.treeBase.setAttribute('class', 'treeBase');
            this.formBase.setAttribute('class', 'formBase');
            $(this.treeBase)
                .on('click', 'member', this, ElementClickEvents_1.clickMember)
                .on('click', 'item', this, ElementClickEvents_1.clickItem)
                .on('click', 'name', this, ElementClickEvents_1.clickName)
                .on('click', 'value', this, ElementClickEvents_1.clickValue);
            this.formFactory = function (id) { return new GenericTreeForm_1.GenericTreeForm(id, _this.formBase); };
            this.manipulate();
            this.form = this.formFactory('startTreeForm');
            this.formControl = new StartTreeForm_1.StartTreeForm(this);
            this.focus();
            this.outputElement = this.root.appendChild(document.createElement('button'));
            this.outputElement.innerHTML = 'Output JSON';
            $(this.outputElement).click(function (e) { return (_this.rootValue && _this.serialize(_this.rootValue.toString(), _this.tab.getTitle())); });
        }
        TreeState.prototype.teardown = function () {
            var nextTab;
            $(this.tab.title).off('click');
            $(this.tab.button).off('click');
            $(this.treeBase)
                .off('click', 'member')
                .off('click', 'item')
                .off('click', 'name')
                .off('click', 'value');
            this.kbsRegister.clear();
            this.kbsRegister.ignore();
            this.history.remove(this.tab);
            this.engine.empty();
            this.tab.blurTab();
            this.tab.closeTab();
            if (this.active) {
                nextTab = this.history.current();
                if (nextTab) {
                    nextTab.state.focus();
                }
            }
            this.tab = null;
            this.history = null;
            this.kbsRegister = null;
            this.navigator = null;
            this.engine = null;
            this.navigationEvents = null;
            this.root = null;
            this.form = null;
            this.formBase = null;
            this.treeBase = null;
            this.formControl = null;
            this.formFactory = null;
            this.rootValue = null;
            return null;
        };
        TreeState.prototype.currentState = function () {
            var tab = this.history.current();
            return tab ? tab.state : null;
        };
        TreeState.prototype.focus = function () {
            if (!this.active) {
                var lastState = this.currentState();
                lastState && lastState.unfocus();
                this.history.push(this.tab);
                this.tab.focusTab();
                this.kbsRegister.listen();
                this.active = true;
            }
        };
        TreeState.prototype.unfocus = function () {
            if (this.active) {
                this.tab.blurTab();
                this.kbsRegister.ignore();
                this.active = false;
            }
        };
        TreeState.prototype.selectedNode = function () {
            return this.navigator.node;
        };
        TreeState.prototype.navigate = function () {
            if (!this.navigating) {
                this.navigating = true;
                this.kbsRegister.unclear(this.navigationEvents);
                this.form = null;
                this.formControl = null;
            }
        };
        TreeState.prototype.manipulate = function () {
            this.navigating = false;
            this.kbsRegister.clear();
            this.formControl && this.formControl.closeForm();
            this.form = null;
            this.formControl = null;
        };
        TreeState.prototype.setRoot = function (type) {
            if (!this.rootValue) {
                this.rootValue = this.engine.createValue(type);
                this.treeBase.appendChild(this.rootValue.e);
                this.navigator.select(this.rootValue);
            }
        };
        TreeState.prototype.getNode = function (e) {
            return this.engine.getNode(e);
        };
        return TreeState;
    }());
    exports.TreeState = TreeState;
});
