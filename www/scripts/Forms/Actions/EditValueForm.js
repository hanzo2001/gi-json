var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GenericFormAction"], function (require, exports, GenericFormAction_1) {
    "use strict";
    var EditValueForm = (function (_super) {
        __extends(EditValueForm, _super);
        function EditValueForm(state) {
            _super.call(this);
            var value = state.selectedNode;
            this.tid = 'editValueForm';
            this.contextData = {
                value: value.getValue()
            };
            this._build(state);
            this.formRoot.find('input[name=value]').focus();
        }
        EditValueForm.prototype.updateValue = function (event) {
            var value = this.target;
            var oldValue = value.getValue();
            var newValue = this.formRoot.find('input[name=value]').val();
            if (oldValue !== newValue) {
                value.setValue(newValue);
            }
            this._close();
        };
        return EditValueForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.EditValueForm = EditValueForm;
});
