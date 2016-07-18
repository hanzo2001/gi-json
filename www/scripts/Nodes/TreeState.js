define(["require", "exports", "../Forms/Actions/NavigationForm", "./NodeEngineUtils", "./NodeHash", "./NodeEngine", "../Forms/GenericTreeFormFactory", "../Forms/KeyboardShortcutRegistry", "../Forms/Actions/StartTreeForm"], function (require, exports, NavigationForm_1, NodeEngineUtils_1, NodeHash_1, NodeEngine_1, GenericTreeFormFactory_1, KeyboardShortcutRegistry_1, StartTreeForm_1) {
    "use strict";
    var TreeState = (function () {
        function TreeState() {
        }
        TreeState.prototype.select = function (node) {
            if (node === this.selectedNode) {
                return;
            }
            var s = this.selectedNode;
            s && s.e && s.e.removeAttribute('class');
            node.e.setAttribute('class', 'selectedNode');
            this.selectedNode = node;
        };
        TreeState.prototype.deselect = function () {
            if (this.selectedNode) {
                this.selectedNode.e.removeAttribute('class');
                this.selectedNode = null;
            }
        };
        TreeState.prototype.navigate = function () {
            this.form = this.formFactory.create('navigationForm');
            this.formControl = new NavigationForm_1.NavigationForm(this);
            this.navigating = true;
        };
        TreeState.prototype.manipulate = function () {
            this.formControl && this.formControl.closeForm();
            this.formControl = null;
            this.form = null;
            this.navigating = false;
        };
        TreeState.prototype.setRoot = function (input) {
            var v = this.engine.createValue(input);
            this.rootValue = v;
            this.treeRoot = v.e;
            this.treeBase.appendChild(v.e);
            this.select(v);
            this.navigating = true;
        };
        TreeState.init = function (config) {
            var events = config.events;
            var state = new TreeState();
            state.navigating = false;
            state.hash = new NodeHash_1.NodeHash();
            state.engine = new NodeEngine_1.NodeEngine(state.hash);
            state.treeBase = document.getElementById('treeBase');
            state.formBase = document.getElementById('formBase');
            state.formFactory = new GenericTreeFormFactory_1.GenericTreeFormFactory(state.formBase);
            state.kbsRegister = new KeyboardShortcutRegistry_1.KeyboardShortcutRegistry(document);
            var rootElement = NodeEngineUtils_1.clearTextNodes(state.treeBase).childNodes.item(0);
            if (rootElement) {
                state.setRoot(rootElement);
                state.navigate();
            }
            else {
                state.form = state.formFactory.create('startTreeForm');
                state.formControl = new StartTreeForm_1.StartTreeForm(state);
            }
            $(state.treeBase)
                .on('click', 'member', state, events.clickMember)
                .on('click', 'item', state, events.clickItem)
                .on('click', 'name', state, events.clickName)
                .on('click', 'value', state, events.clickValue);
            $('#outputJSON')
                .click(state, function (event) {
                if (event.data.rootValue) {
                    $('#jsonOutput').html(event.data.rootValue + '');
                }
            });
            return state;
        };
        return TreeState;
    }());
    exports.TreeState = TreeState;
});
