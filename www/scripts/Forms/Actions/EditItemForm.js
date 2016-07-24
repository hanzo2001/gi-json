var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GenericFormAction", "../GenericTreeFormCommons"], function (require, exports, GenericFormAction_1, GenericTreeFormCommons_1) {
    "use strict";
    var EditItemForm = (function (_super) {
        __extends(EditItemForm, _super);
        function EditItemForm(state) {
            _super.call(this);
            var item = state.selectedNode();
            this.tid = 'editItemForm';
            this.contextData = {
                types: GenericTreeFormCommons_1.valueTypes,
                selectedType: item.getType(),
                dflt: null
            };
            this._build(state);
            this.formRoot.find('select[name=itemType]').focus();
        }
        EditItemForm.prototype.updateItem = function (event) {
            var item = this.target;
            var arrayValue = item.getParentValue();
            var oldType = item.getType();
            var newType = this.formRoot.find('select[name=itemType]').val();
            if (oldType !== newType) {
                item.setType(newType);
            }
            this._close();
        };
        EditItemForm.prototype.deleteItem = function (event) {
            var item = this.target;
            var arrayValue = item.parent();
            var index = item.getIndex();
            var next = item.next() || item.prev() || arrayValue;
            this.state.navigator.select(next);
            arrayValue.removeItem(index);
            this._close();
        };
        return EditItemForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.EditItemForm = EditItemForm;
});
