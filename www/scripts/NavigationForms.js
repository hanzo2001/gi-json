var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jquery", "./TreeForms"], function (require, exports, $, TreeForms_1) {
    "use strict";
    var NavigationForms = (function (_super) {
        __extends(NavigationForms, _super);
        function NavigationForms() {
            _super.apply(this, arguments);
            this.tid = 'navigationForm';
            this.isClosed = false;
        }
        NavigationForms.prototype.build = function () {
            this._formContextData = {};
            try {
                this._build();
            }
            catch (e) {
                console.log(e);
            }
        };
        NavigationForms.prototype._build = function () {
            this.state.navigationForm = this;
            console.log('building');
            this.form = this.showTemplate(this.tid, this.state.formBase, this._formContextData);
            var behaviors = this.form.data('behavior');
            if (behaviors) {
                behaviors.split(' ').forEach(function (mth) { this[mth](); }, this);
            }
            var buttons = this.form.find('button[data-action]');
            buttons.each(this._attachButtonEvent.bind(this));
            this._attachKeyboardShortcuts();
        };
        NavigationForms.prototype.closeForm = function () {
            if (this.isClosed) {
                return;
            }
            this.isClosed = true;
            if (this._sid) {
                $(document).off('keyup.' + this.tid);
            }
            this.form.css('display', 'none');
            this.blockClicks();
        };
        NavigationForms.prototype.showForm = function () {
            if (!this.isClosed) {
                return;
            }
            this.isClosed = false;
            this._attachKeyboardShortcuts();
            this.form.css('display', 'block');
            this.allowClicks();
        };
        NavigationForms.prototype.goParent = function (event) {
            var e = this.state.selectedNode.e.parentElement;
            if (e.tagName === 'DIV') {
                return;
            }
            var o = this.state.hash.getNode(e);
            this.state.select(o);
        };
        NavigationForms.prototype.goPrev = function (event) {
            var o = this.state.selectedNode;
            if (o.prev) {
                var c = o.prev();
                c && this.state.select(c);
            }
        };
        NavigationForms.prototype.goFirst = function (event) {
            var o = this.state.selectedNode;
            if (o.first) {
                var c = o.first();
                c && this.state.select(c);
            }
        };
        NavigationForms.prototype.goNext = function (event) {
            var o = this.state.selectedNode;
            if (o.next) {
                var c = o.next();
                c && this.state.select(c.next());
            }
        };
        return NavigationForms;
    }(TreeForms_1.TreeForm));
    exports.NavigationForms = NavigationForms;
});
