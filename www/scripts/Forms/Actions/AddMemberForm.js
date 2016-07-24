var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GenericFormAction", "../GenericTreeFormCommons"], function (require, exports, GenericFormAction_1, GenericTreeFormCommons_1) {
    "use strict";
    var AddMemberForm = (function (_super) {
        __extends(AddMemberForm, _super);
        function AddMemberForm(state) {
            _super.call(this);
            var objectValue = state.selectedNode();
            this.tid = 'addMemberForm';
            this.contextData = {
                types: GenericTreeFormCommons_1.valueTypes,
                selectedType: 'u',
                dflt: null
            };
            this._build(state);
            this.formRoot.find('input[name=memberName]').focus();
        }
        AddMemberForm.prototype.createMember = function (event) {
            var memberNameElement = this.formRoot.find('input[name=memberName]');
            var name = memberNameElement.val();
            if (name) {
                var objectValue = this.target;
                var type = this.formRoot.find('select[name=memberType]').val();
                objectValue.addMember(name, type);
            }
            memberNameElement.val('');
            memberNameElement.focus();
        };
        return AddMemberForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.AddMemberForm = AddMemberForm;
});
