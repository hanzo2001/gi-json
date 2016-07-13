define(["require", "exports", "jquery", "handlebars"], function (require, exports, $, Handlebars) {
    "use strict";
    var GenericTreeForm = (function () {
        function GenericTreeForm(id, formBase) {
            this._tid = id;
            this._formBase = formBase;
            this._script = Handlebars.compile($('#' + id).html());
            this._loaded = false;
        }
        GenericTreeForm.prototype.id = function () {
            return this._tid;
        };
        GenericTreeForm.prototype.get = function () {
            return this._form;
        };
        GenericTreeForm.prototype.show = function (data) {
            if (!this._loaded) {
                this._form = $(this._script(data));
                $(this._formBase).append(this._form);
                this._loaded = true;
            }
        };
        GenericTreeForm.prototype.remove = function () {
            if (this._loaded) {
                this._form.remove();
                this._loaded = false;
            }
        };
        return GenericTreeForm;
    }());
    exports.GenericTreeForm = GenericTreeForm;
});
