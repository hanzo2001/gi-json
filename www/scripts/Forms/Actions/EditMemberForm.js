var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GenericFormAction", "../GenericTreeFormCommons"], function (require, exports, GenericFormAction_1, GenericTreeFormCommons_1) {
    "use strict";
    var EditMemberForm = (function (_super) {
        __extends(EditMemberForm, _super);
        function EditMemberForm(state) {
            _super.call(this);
            var member = state.selectedNode();
            this.tid = 'editMemberForm';
            this.contextData = {
                name: member.getName(),
                types: GenericTreeFormCommons_1.valueTypes,
                selectedType: member.getType(),
                dflt: null
            };
            this._build(state);
            this.formRoot.find('select[name=memberType]').focus();
        }
        EditMemberForm.prototype.updateMember = function (event) {
            var member = this.target;
            var objectValue = member.getParentValue();
            var oldName = member.getName();
            var oldType = member.getType();
            var newNameInput = this.formRoot.find('input[name=memberName]');
            var newName = newNameInput.val();
            var newType = this.formRoot.find('select[name=memberType]').val();
            if (oldType !== newType) {
                member.setType(newType);
            }
            if (oldName !== newName) {
                objectValue.renameMember(oldName, newName);
                this._close();
            }
            else {
                newNameInput.focus();
            }
        };
        EditMemberForm.prototype.deleteMember = function (event) {
            var member = this.target;
            var name = member.getName();
            var objectValue = member.parent();
            var next = member.next() || member.prev() || objectValue;
            this.state.navigator.select(next);
            objectValue.removeMember(name);
            this._close();
        };
        return EditMemberForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.EditMemberForm = EditMemberForm;
});
