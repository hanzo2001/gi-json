var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jquery", "./GenericFormAction"], function (require, exports, $, GenericFormAction_1) {
    "use strict";
    var NavigationForm = (function (_super) {
        __extends(NavigationForm, _super);
        function NavigationForm(state) {
            _super.call(this);
            this.tid = 'navigationForm';
            this.isClosed = false;
            this.tid = 'navigationForm';
            this.contextData = {};
            this._build(state);
        }
        NavigationForm.prototype.triggerClick = function (event) {
            var node = this.state.selectedNode.e;
            var e = jQuery.Event('click');
            e.target = node;
            try {
                $(this.state.treeBase).trigger(e);
            }
            catch (e) {
                console.log(e);
            }
        };
        NavigationForm.prototype.goParent = function (event) {
            var selected = this.state.selectedNode;
            var e = selected.e.parentElement;
            if (e.tagName === 'DIV') {
                return;
            }
            var o = selected.getParent();
            this.state.select(o);
        };
        NavigationForm.prototype.goPrev = function (event) {
            var selected = this.state.selectedNode;
            if (selected.prev) {
                var c = selected.prev();
                c && this.state.select(c);
            }
            else {
                var p = selected.getParent();
                if (p && p.prev) {
                    var c = p.prev();
                    c && this.state.select(c.v);
                }
            }
        };
        NavigationForm.prototype.goFirst = function (event) {
            var selected = this.state.selectedNode;
            if (selected.first) {
                var c = selected.first();
                c && this.state.select(c);
            }
            else {
                var e = selected.e.lastChild;
                if (e instanceof HTMLElement) {
                    var l = this.state.hash.getNode(e);
                    l && this.state.select(l);
                }
            }
        };
        NavigationForm.prototype.goNext = function (event) {
            var selected = this.state.selectedNode;
            if (selected.next) {
                var c = selected.next();
                c && this.state.select(c);
            }
            else {
                var p = selected.getParent();
                if (p && p.next) {
                    var c = p.next();
                    c && this.state.select(c.v);
                }
            }
        };
        return NavigationForm;
    }(GenericFormAction_1.GenericFormAction));
    exports.NavigationForm = NavigationForm;
});
