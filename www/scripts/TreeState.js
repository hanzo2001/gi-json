define(["require", "exports", "./Forms/Actions/NavigationForm"], function (require, exports, NavigationForm_1) {
    "use strict";
    var TreeState = (function () {
        function TreeState() {
        }
        TreeState.prototype.factory = function (input) {
            return this.engine(this.hash, input);
        };
        TreeState.prototype.select = function (node) {
            if (node === this.selectedNode) {
                return;
            }
            var s = this.selectedNode;
            s && s.e && s.e.removeAttribute('class');
            node.e.setAttribute('class', 'selectedNode');
            this.selectedNode = node;
        };
        TreeState.prototype.deselect = function () {
            if (this.selectedNode) {
                this.selectedNode.e.removeAttribute('class');
                this.selectedNode = null;
            }
        };
        TreeState.prototype.navigate = function () {
            this.form = this.formFactory.create('navigationForm');
            this.formControl = new NavigationForm_1.NavigationForm(this);
            this.navigating = true;
        };
        TreeState.prototype.manipulate = function () {
            this.formControl && this.formControl.closeForm();
            this.formControl = null;
            this.form = null;
            this.navigating = false;
        };
        TreeState.prototype.setRoot = function (v) {
            this.rootValue = v;
            this.treeRoot = v.e;
            this.treeBase.appendChild(v.e);
            this.select(v);
            this.navigating = true;
        };
        return TreeState;
    }());
    exports.TreeState = TreeState;
});
