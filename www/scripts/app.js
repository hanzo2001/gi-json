define(["require", "exports", "jquery", "./NodeEngineUtils", "./NodeHash", "./NodeEngine", "./TreeState", "./Forms/KeyboardShortcutRegistry", "./Forms/GenericTreeFormFactory", "./Forms/Actions/StartTreeForm", "./Forms/Actions/AddItemForm", "./Forms/Actions/AddMemberForm", "./Forms/Actions/EditItemForm", "./Forms/Actions/EditMemberForm", "./Forms/Actions/EditValueForm", "./Forms/Actions/SwitchTypeForm", "helpers"], function (require, exports, $, NodeEngineUtils_1, NodeHash_1, NodeEngine_1, TreeState_1, KeyboardShortcutRegistry_1, GenericTreeFormFactory_1, StartTreeForm_1, AddItemForm_1, AddMemberForm_1, EditItemForm_1, EditMemberForm_1, EditValueForm_1, SwitchTypeForm_1) {
    "use strict";
    var state = new TreeState_1.TreeState();
    $(function () {
        try {
            state.navigating = false;
            state.hash = new NodeHash_1.NodeHash();
            state.engine = NodeEngine_1.NodeEngine;
            state.treeBase = document.getElementById('treeBase');
            state.formBase = document.getElementById('formBase');
            state.formFactory = new GenericTreeFormFactory_1.GenericTreeFormFactory(state.formBase);
            state.kbsRegister = new KeyboardShortcutRegistry_1.KeyboardShortcutRegistry(document);
            var rootElement = NodeEngineUtils_1.clearTextNodes(state.treeBase).childNodes.item(0);
            if (rootElement) {
                var v = state.factory(rootElement);
                state.setRoot(v);
                state.navigate();
            }
            else {
                state.form = state.formFactory.create('startTreeForm');
                state.formControl = new StartTreeForm_1.StartTreeForm(state);
            }
            $(state.treeBase)
                .on('click', 'member', state, clickMember)
                .on('click', 'item', state, clickItem)
                .on('click', 'name', state, clickName)
                .on('click', 'value', state, clickValue);
            $('#outputJSON')
                .click(state, function (event) {
                if (event.data.rootValue) {
                    $('#jsonOutput').text(event.data.rootValue + '');
                }
            });
            window.t = state.rootValue;
        }
        catch (e) {
            console.log(e);
        }
    });
    function clickItem(event) {
        event.stopPropagation();
        var itemElement = this;
        var state = event.data;
        var item = state.hash.getNode(itemElement);
        state.manipulate();
        state.select(item);
        state.form = state.formFactory.create('editItemForm');
        state.formControl = new EditItemForm_1.EditItemForm(state);
    }
    function clickMember(event) {
        event.stopPropagation();
        var memberElement = this;
        var state = event.data;
        var member = state.hash.getNode(memberElement);
        state.manipulate();
        state.select(member);
        state.form = state.formFactory.create('editMemberForm');
        state.formControl = new EditMemberForm_1.EditMemberForm(state);
    }
    function clickName(event) {
        event.stopPropagation();
        var nameElement = this;
        var memberElement = nameElement.parentElement;
        var state = event.data;
        var member = state.hash.getNode(memberElement);
        state.manipulate();
        state.select(member);
        state.form = state.formFactory.create('editMemberForm');
        state.formControl = new EditMemberForm_1.EditMemberForm(state);
    }
    function clickValue(event) {
        event.stopPropagation();
        var valueElement = this;
        var state = event.data;
        var value = state.hash.getNode(valueElement);
        var type = value.type;
        state.manipulate();
        state.select(value);
        switch (type) {
            case 'u':
                state.form = state.formFactory.create('switchTypeForm');
                state.formControl = new SwitchTypeForm_1.SwitchTypeForm(state);
                break;
            case 'b':
                value.setValue(!value.getValue());
                state.navigate();
                break;
            case 's':
                state.form = state.formFactory.create('editValueForm');
                state.formControl = new EditValueForm_1.EditValueForm(state);
                break;
            case 'n':
                state.form = state.formFactory.create('editValueForm');
                state.formControl = new EditValueForm_1.EditValueForm(state);
                break;
            case 'o':
                state.form = state.formFactory.create('addMemberForm');
                state.formControl = new AddMemberForm_1.AddMemberForm(state);
                break;
            case 'a':
                state.form = state.formFactory.create('addItemForm');
                state.formControl = new AddItemForm_1.AddItemForm(state);
                break;
        }
    }
});
