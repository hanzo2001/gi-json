var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./GenericFormAction", "../GenericTreeFormCommons"], function (require, exports, GenericFormAction_1, GenericTreeFormCommons_1) {
    "use strict";
    var StartTreeForm = (function (_super) {
        __extends(StartTreeForm, _super);
        function StartTreeForm(state) {
            _super.call(this);
            this.tid = 'startTreeForm';
            this.contextData = {
                types: GenericTreeFormCommons_1.complexTypes,
                selectedType: 'o',
                dflt: null
            };
            this._build(state);
            this.formRoot.find('select[name=rootType]').focus();
        }
        StartTreeForm.prototype.createRoot = function (event) {
            var type = this.formRoot.find('select[name=rootType]').val();
            var value = this.state.factory(type);
            this.state.select(value);
            this._close();
        };
        return StartTreeForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.StartTreeForm = StartTreeForm;
});
