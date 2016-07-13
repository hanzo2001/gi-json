define(["require", "exports", "jquery", "./NodeEngineUtils", "./NodeHash", "./NodeEngine", "./TreeState", "./Forms/KeyboardShortcutRegistry", "./Forms/Actions/StartTreeForm", "./Forms/Actions/AddItemForm", "./Forms/Actions/AddMemberForm", "./Forms/Actions/EditItemContainerForm", "./Forms/Actions/EditMemberContainerForm", "./Forms/Actions/EditMemberForm", "./Forms/Actions/EditableValueForm", "./Forms/Actions/SwitchTypeForm", "./Forms/GenericTreeFormFactory", "helpers"], function (require, exports, $, NodeEngineUtils_1, NodeHash_1, NodeEngine_1, TreeState_1, KeyboardShortcutRegistry_1, StartTreeForm_1, AddItemForm_1, AddMemberForm_1, EditItemContainerForm_1, EditMemberContainerForm_1, EditMemberForm_1, EditableValueForm_1, SwitchTypeForm_1, GenericTreeFormFactory_1) {
    "use strict";
    var state = new TreeState_1.TreeState();
    $(function () {
        try {
            state.hash = new NodeHash_1.NodeHash();
            state.engine = NodeEngine_1.NodeEngine;
            state.treeBase = document.getElementById('treeBase');
            state.formBase = document.getElementById('formBase');
            state.formFactory = new GenericTreeFormFactory_1.GenericTreeFormFactory(state.formBase);
            state.kbsRegister = new KeyboardShortcutRegistry_1.KeyboardShortcutRegistry(document);
            var rootElement = NodeEngineUtils_1.clearTextNodes(state.treeBase).childNodes.item(0);
            if (rootElement) {
                state.factory(rootElement);
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
    function clickMember(event) {
        console.log('app.clickMember');
        event.stopPropagation();
        var memberElement = this;
        var state = event.data;
        try {
            state.manipulate();
            state.form = state.formFactory.create('editMemberContainerForm');
            var member = state.hash.getNode(memberElement);
            state.select(member);
            state.formControl = new EditMemberContainerForm_1.EditMemberContainerForm(state);
        }
        catch (e) {
            console.log(e);
        }
    }
    function clickItem(event) {
        console.log('app.clickItem');
        event.stopPropagation();
        var itemElement = this;
        var state = event.data;
        state.manipulate();
        state.form = state.formFactory.create('editItemContainerForm');
        var item = state.hash.getNode(itemElement);
        state.select(item);
        state.formControl = new EditItemContainerForm_1.EditItemContainerForm(state);
    }
    function clickName(event) {
        console.log('app.clickName');
        event.stopPropagation();
        var nameElement = this;
        var memberElement = nameElement.parentElement;
        var state = event.data;
        state.manipulate();
        state.form = state.formFactory.create('editMemberForm');
        var member = state.hash.getNode(memberElement);
        state.select(member);
        state.formControl = new EditMemberForm_1.EditMemberForm(state);
    }
    function clickValue(event) {
        console.log('app.clickValue');
        event.stopPropagation();
        var valueElement = this;
        var state = event.data;
        state.manipulate();
        var value = state.hash.getNode(valueElement);
        var type = value.type;
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
                state.form = state.formFactory.create('editableValueForm');
                state.formControl = new EditableValueForm_1.EditableValueForm(state);
                break;
            case 'n':
                state.form = state.formFactory.create('editableValueForm');
                state.formControl = new EditableValueForm_1.EditableValueForm(state);
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
