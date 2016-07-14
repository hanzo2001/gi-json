var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jquery", "./GenericFormAction"], function (require, exports, $, GenericFormAction_1) {
    "use strict";
    var EditMemberContainerForm = (function (_super) {
        __extends(EditMemberContainerForm, _super);
        function EditMemberContainerForm(state) {
            _super.call(this);
            this.tid = 'editMemberContainerForm';
            var member = state.selectedNode;
            var objectValue = member.getParent();
            state.select(objectValue);
            this.contextData = {
                members: objectValue.getMemberNames()
            };
            this._build(state);
        }
        EditMemberContainerForm.prototype.removeMember = function (event) {
            var button = event.currentTarget;
            var li = button.parentElement;
            var name = button.dataset['memberName'];
            var objectValue = this.target;
            objectValue.removeMember(name);
            $(button).remove();
            $(li).remove();
            if (!objectValue.s) {
                this._close();
            }
        };
        return EditMemberContainerForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.EditMemberContainerForm = EditMemberContainerForm;
});
