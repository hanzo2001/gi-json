define(["require", "exports", "jquery", "./NodeHash", "./NodeEngine", "./TreeState", "./TreeForms", "helpers"], function (require, exports, $, NodeHash_1, NodeEngine_1, TreeState_1, TreeForms_1) {
    "use strict";
    $(function () {
        try {
            var engine = NodeEngine_1.NodeEngine;
            var hash = new NodeHash_1.NodeHash();
            var state = new TreeState_1.TreeState(hash, engine);
            state.treeBase = document.getElementById('treeBase');
            state.formBase = document.getElementById('formBase');
            state.rootElement = state.treeBase.childNodes.item(1);
            if (state.rootElement) {
                state.rootValue = state.factory(state.rootElement);
            }
            else {
                (new TreeForms_1.StartTreeForm(state)).build();
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
        event.stopPropagation();
        var memberElement = this;
        var state = event.data;
        var controlForm = state.controlForm;
        if (controlForm) {
            controlForm.closeForm();
        }
        controlForm = new TreeForms_1.EditMemberContainerForm(state);
        controlForm.build(state.hash.getNode(memberElement));
        state.controlForm = controlForm;
    }
    function clickItem(event) {
        event.stopPropagation();
        var itemElement = this;
        var state = event.data;
        var controlForm = state.controlForm;
        if (controlForm) {
            controlForm.closeForm();
        }
        controlForm = new TreeForms_1.EditItemContainerForm(state);
        controlForm.build(state.hash.getNode(itemElement));
        state.controlForm = controlForm;
    }
    function clickName(event) {
        event.stopPropagation();
        var name = this;
        var member = name.parentElement;
        var state = event.data;
        var controlForm = state.controlForm;
        if (controlForm) {
            controlForm.closeForm();
        }
        controlForm = new TreeForms_1.EditMemberForm(state);
        controlForm.build(state.hash.getNode(member));
        state.controlForm = controlForm;
    }
    function clickValue(event) {
        event.stopPropagation();
        var valueElement = this;
        var state = event.data;
        var controlForm = state.controlForm;
        if (controlForm) {
            controlForm.closeForm();
        }
        state.controlForm = controlForm = null;
        var value = state.hash.getNode(valueElement);
        var type = value.type;
        switch (type) {
            case 'u':
                controlForm = new TreeForms_1.SwitchTypeForm(state);
                break;
            case 'b':
                value.setValue(!value.getValue());
                break;
            case 's':
                controlForm = new TreeForms_1.EditableValueForm(state);
                break;
            case 'n':
                controlForm = new TreeForms_1.EditableValueForm(state);
                break;
            case 'o':
                controlForm = new TreeForms_1.AddMemberForm(state);
                break;
            case 'a':
                controlForm = new TreeForms_1.AddItemForm(state);
                break;
        }
        state.controlForm = controlForm;
        controlForm && controlForm.build(value);
    }
});
