var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GenericFormAction", "../GenericTreeFormCommons"], function (require, exports, GenericFormAction_1, GenericTreeFormCommons_1) {
    "use strict";
    var SwitchTypeForm = (function (_super) {
        __extends(SwitchTypeForm, _super);
        function SwitchTypeForm(state) {
            _super.call(this);
            var value = state.selectedNode;
            this.tid = 'switchTypeForm';
            this.contextData = {
                types: GenericTreeFormCommons_1.valueTypes,
                selectedType: 'o',
                dflt: null
            };
            this._build(state);
            this.formRoot.find('select[name=valueType]').focus();
        }
        SwitchTypeForm.prototype.updateValue = function (event) {
            var value = this.target;
            var container = value.getParentContainer();
            var oldType = value.getDisplayValue();
            var newType = this.formRoot.find('select[name=valueType]').val();
            if (oldType !== newType) {
                this.state.select(container.setType(newType));
            }
            this._close();
        };
        return SwitchTypeForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.SwitchTypeForm = SwitchTypeForm;
});
