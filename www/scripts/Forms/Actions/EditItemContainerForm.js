var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GenericFormAction", "../GenericTreeFormCommons"], function (require, exports, GenericFormAction_1, GenericTreeFormCommons_1) {
    "use strict";
    var EditItemContainerForm = (function (_super) {
        __extends(EditItemContainerForm, _super);
        function EditItemContainerForm(state) {
            _super.call(this);
            var item = state.selectedNode;
            this.tid = 'editItemContainerForm';
            var arrayValue = item.getParentValue();
            this.contextData = {
                items: (function (items, a, s, i) {
                    while (i < s) {
                        a[i] = GenericTreeFormCommons_1.valueTypes[items[i].getType()];
                        i++;
                    }
                    return a;
                }(arrayValue.items, new Array(arrayValue.s), arrayValue.s, 0)),
            };
            state.select(arrayValue);
            this._build(state);
        }
        EditItemContainerForm.prototype.removeItem = function (event) {
            var button = event.currentTarget;
            var li = button.parentElement;
            var index = $(li).index();
            var arrayValue = this.target;
            console.log(li, index);
            arrayValue.removeItem(index);
            $(li).remove();
            if (!arrayValue.s) {
                this._close();
            }
        };
        return EditItemContainerForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.EditItemContainerForm = EditItemContainerForm;
});
