define(["require", "exports", "../Forms/Actions/AddItemForm", "../Forms/Actions/AddMemberForm", "../Forms/Actions/EditItemForm", "../Forms/Actions/EditMemberForm", "../Forms/Actions/EditValueForm", "../Forms/Actions/SwitchTypeForm"], function (require, exports, AddItemForm_1, AddMemberForm_1, EditItemForm_1, EditMemberForm_1, EditValueForm_1, SwitchTypeForm_1) {
    "use strict";
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
    exports.clickItem = clickItem;
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
    exports.clickMember = clickMember;
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
    exports.clickName = clickName;
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
    exports.clickValue = clickValue;
});
