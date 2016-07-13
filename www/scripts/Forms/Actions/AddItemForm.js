var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GenericFormAction", "../GenericTreeFormCommons"], function (require, exports, GenericFormAction_1, GenericTreeFormCommons_1) {
    "use strict";
    var AddItemForm = (function (_super) {
        __extends(AddItemForm, _super);
        function AddItemForm(state) {
            _super.call(this);
            var arrayValue = state.selectedNode;
            this.tid = 'addItemForm';
            this.contextData = {
                types: GenericTreeFormCommons_1.valueTypes,
                selectedType: 'u',
                dflt: null,
                itemOffset: arrayValue.s
            };
            this._build(state);
            this.formRoot.find('select[name=itemType]').focus();
        }
        AddItemForm.prototype.createItem = function (event) {
            var typeInput = this.formRoot.find('select[name=itemType]');
            var amountInput = this.formRoot.find('input[name=itemAmount]');
            var offsetInput = this.formRoot.find('input[name=itemOffset]');
            var type = typeInput.val();
            var amount = ~~amountInput.val();
            var offset = ~~offsetInput.val();
            var arrayValue = this.target;
            if (!amount || amount === 1) {
                arrayValue.addItem(type, offset);
            }
            else {
                arrayValue.addItems(amount, type, offset);
            }
            offsetInput.val(arrayValue.s);
            amountInput.val('1');
            typeInput.focus();
        };
        return AddItemForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.AddItemForm = AddItemForm;
});
