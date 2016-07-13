define(["require", "exports", "./Forms/Actions/NavigationForm"], function (require, exports, NavigationForm_1) {
    "use strict";
    var TreeState = (function () {
        function TreeState() {
        }
        TreeState.prototype.factory = function (input) {
            var v = this.engine(this.hash, input);
            if (!this.rootValue) {
                this.rootValue = v;
                this.treeRoot = v.e;
                this.treeBase.appendChild(v.e);
                this.select(v);
            }
            return v;
        };
        TreeState.prototype.select = function (node) {
            if (node === this.selectedNode) {
                return;
            }
            if (this.selectedNode) {
                this.selectedNode.e.removeAttribute('class');
            }
            this.selectedNode = node;
            this.selectedNode.e.setAttribute('class', 'selectedNode');
        };
        TreeState.prototype.deselect = function () {
            if (this.selectedNode) {
                this.selectedNode.e.removeAttribute('class');
                this.selectedNode = null;
            }
        };
        TreeState.prototype.navigate = function () {
            console.log('state.navigate');
            this.form = this.formFactory.create('navigationForm');
            this.formControl = new NavigationForm_1.NavigationForm(this);
            this.navigating = true;
        };
        TreeState.prototype.manipulate = function () {
            console.log('state.manipulate');
            this.formControl && this.formControl.closeForm();
            this.formControl = null;
            this.form = null;
            this.navigating = false;
        };
        return TreeState;
    }());
    exports.TreeState = TreeState;
});
