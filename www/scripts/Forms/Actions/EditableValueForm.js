var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GenericFormAction"], function (require, exports, GenericFormAction_1) {
    "use strict";
    var EditableValueForm = (function (_super) {
        __extends(EditableValueForm, _super);
        function EditableValueForm(state) {
            _super.call(this);
            var value = state.selectedNode;
            this.tid = 'editableValueForm';
            this.contextData = {
                value: value.getDisplayValue()
            };
            this._build(state);
            this.formRoot.find('input[name=value]').focus();
        }
        EditableValueForm.prototype.updateValue = function (event) {
            var value = this.target;
            var oldValue = value.getDisplayValue();
            var newValue = this.formRoot.find('input[name=value]').val();
            if (oldValue !== newValue) {
                value.setValue(newValue);
            }
            this._close();
        };
        return EditableValueForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.EditableValueForm = EditableValueForm;
});
