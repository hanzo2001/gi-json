define(["require", "exports", 'jquery'], function (require, exports, $) {
    "use strict";
    var GenericFormAction = (function () {
        function GenericFormAction() {
        }
        GenericFormAction.prototype._build = function (state) {
            console.log('genAction._build');
            this.state = state;
            this.form = state.form;
            this.form.show(this.contextData);
            this.formRoot = this.form.get();
            this.target = state.selectedNode;
            this.kbsManager = state.kbsRegister;
            this.formRoot.find('[data-action]').each(this._attachButtonEvent.bind(this));
        };
        GenericFormAction.prototype._attachButtonEvent = function (i, button) {
            var action = button.dataset['action'];
            var kbs = ~~(button.dataset['kbs'] || null);
            var cb = this[action] || null;
            if (cb) {
                cb = cb.bind(this);
                $(button).click(cb);
                if (kbs) {
                    this.kbsManager.registerShortcut(kbs, cb);
                }
            }
        };
        GenericFormAction.prototype._close = function () {
            console.log('genAction._close');
            this.kbsManager && this.kbsManager.unregisterShortcut();
            this.form && this.form.remove();
            this.contextData = null;
            this.form = null;
            this.formRoot = null;
            this.target = null;
            this.kbsManager = null;
            if (!this.state.navigating) {
                this.state.navigate();
            }
        };
        GenericFormAction.prototype.closeForm = function () {
            console.log('genAction.closeForm');
            try {
                this._close();
            }
            catch (e) {
                console.log(e);
            }
        };
        return GenericFormAction;
    }());
    exports.GenericFormAction = GenericFormAction;
});
