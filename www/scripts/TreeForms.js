var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jquery", "handlebars"], function (require, exports, $, Handlebars) {
    "use strict";
    exports.primitiveTypes = {
        u: 'null',
        s: 'string',
        b: 'bool',
        n: 'number',
    };
    exports.complexTypes = {
        a: 'array',
        o: 'object'
    };
    exports.valueTypes = $.extend(Object.create(null), exports.primitiveTypes, exports.complexTypes);
    var TreeForm = (function () {
        function TreeForm(state) {
            this.tid = '';
            this._buttons = {};
            this._keyCodes = {};
            this._sid = 0;
            this.cache = {};
            this.state = state;
        }
        TreeForm.prototype.build = function (o) { };
        TreeForm.prototype._build = function () {
            this.state.controlForm = this;
            this.form = this.showTemplate(this.tid, this.state.formBase, this._formContextData);
            var behaviors = this.form.data('behavior');
            if (behaviors) {
                behaviors.split(' ').forEach(function (mth) { this[mth](); }, this);
            }
            var buttons = this.form.find('button[data-action]');
            buttons.each(this._attachButtonEvent.bind(this));
            this._attachKeyboardShortcuts();
        };
        TreeForm.prototype.closeForm = function () {
            if (this._sid) {
                $(document).off('keyup.' + this.tid);
            }
            this.state.controlForm = null;
            this.form.remove();
            this.allowClicks();
        };
        TreeForm.prototype.blockClicks = function () {
            this.state.blockClicks();
        };
        TreeForm.prototype.allowClicks = function () {
            this.state.allowClicks();
        };
        TreeForm.prototype._attachButtonEvent = function (i, button) {
            var action = button.dataset['action'];
            var cb = this[action] || null;
            if (cb) {
                $(button).click(cb.bind(this));
                var keyCode = ~~button.dataset['kbs'];
                if (keyCode) {
                    this._sid++;
                    this._buttons[this._sid] = button;
                    this._keyCodes[keyCode] = this._sid;
                }
            }
        };
        TreeForm.prototype._attachKeyboardShortcuts = function () {
            if (this._sid) {
                var data = {
                    k: this._keyCodes,
                    b: this._buttons
                };
                $(document).on('keyup.' + this.tid, data, function (event) {
                    var data = event.data;
                    var id = data.k[event.keyCode];
                    id && $(data.b[id]).click();
                });
            }
        };
        TreeForm.prototype.showTemplate = function (id, target, data) {
            var html;
            var script = this.cache[id];
            if (!script) {
                this.cache[id] = script = Handlebars.compile($('#' + id).html());
            }
            html = $(script(data));
            $(target).append(html);
            this.state.blockClicks();
            return html;
        };
        return TreeForm;
    }());
    var AddItemForm = (function (_super) {
        __extends(AddItemForm, _super);
        function AddItemForm() {
            _super.apply(this, arguments);
            this.tid = 'addItemForm';
        }
        AddItemForm.prototype.build = function (arrayValue) {
            this.arrayValue = arrayValue;
            this._formContextData = {
                types: exports.valueTypes,
                selectedType: 'u',
                dflt: null,
                itemOffset: arrayValue.s
            };
            _super.prototype._build.call(this);
            this.form.find('select[name=itemType]').focus();
        };
        AddItemForm.prototype.createItem = function (event) {
            var typeInput = this.form.find('select[name=itemType]');
            var amountInput = this.form.find('input[name=itemAmount]');
            var offsetInput = this.form.find('input[name=itemOffset]');
            var type = typeInput.val();
            var amount = ~~amountInput.val();
            var offset = ~~offsetInput.val();
            if (!amount || amount === 1) {
                this.arrayValue.addItem(type, offset);
            }
            else {
                this.arrayValue.addItems(amount, type, offset);
            }
            offsetInput.val(this.arrayValue.s);
            amountInput.val('1');
            typeInput.focus();
        };
        return AddItemForm;
    }(TreeForm));
    exports.AddItemForm = AddItemForm;
    var EditItemContainerForm = (function (_super) {
        __extends(EditItemContainerForm, _super);
        function EditItemContainerForm() {
            _super.apply(this, arguments);
            this.tid = 'editItemContainerForm';
        }
        EditItemContainerForm.prototype.build = function (item) {
            this.item = item;
            this.arrayValue = item.getParent();
            this._formContextData = {
                items: (function (items, a, s, i) {
                    while (i < s) {
                        a[i] = exports.valueTypes[items[i].getType()];
                        i++;
                    }
                    return a;
                }(this.arrayValue.items, new Array(this.arrayValue.s), this.arrayValue.s, 0)),
                id: this.arrayValue.getNodeId()
            };
            _super.prototype._build.call(this);
        };
        EditItemContainerForm.prototype.removeItem = function (event) {
            var button = event.currentTarget;
            var li = button.parentElement;
            var index = $(li).index();
            console.log(li, index);
            this.arrayValue.removeItem(index);
            $(li).remove();
            if (!this.arrayValue.s) {
                this.closeForm();
            }
        };
        return EditItemContainerForm;
    }(TreeForm));
    exports.EditItemContainerForm = EditItemContainerForm;
    var AddMemberForm = (function (_super) {
        __extends(AddMemberForm, _super);
        function AddMemberForm() {
            _super.apply(this, arguments);
            this.tid = 'addMemberForm';
        }
        AddMemberForm.prototype.build = function (objectValue) {
            this.objectValue = objectValue;
            this._formContextData = {
                types: exports.valueTypes,
                selectedType: 'u',
                dflt: null
            };
            _super.prototype._build.call(this);
            this.form.find('input[name=memberName]').focus();
        };
        AddMemberForm.prototype.createMember = function (event) {
            var memberNameElement = this.form.find('input[name=memberName]');
            var name = memberNameElement.val();
            if (name && !/[^\w-]/.test(name)) {
                var type = this.form.find('select[name=memberType]').val();
                this.objectValue.addMember(name, type);
            }
            memberNameElement.val('');
            memberNameElement.focus();
        };
        return AddMemberForm;
    }(TreeForm));
    exports.AddMemberForm = AddMemberForm;
    var EditMemberContainerForm = (function (_super) {
        __extends(EditMemberContainerForm, _super);
        function EditMemberContainerForm() {
            _super.apply(this, arguments);
            this.tid = 'editMemberContainerForm';
        }
        EditMemberContainerForm.prototype.build = function (member) {
            this.member = member;
            this.objectValue = member.getParent();
            this._formContextData = {
                members: this.objectValue.getMemberNames()
            };
            _super.prototype._build.call(this);
        };
        EditMemberContainerForm.prototype.removeMember = function (event) {
            var button = event.currentTarget;
            var li = button.parentElement;
            var name = button.dataset['memberName'];
            this.objectValue.removeMember(name);
            $(button).remove();
            $(li).remove();
            if (!this.objectValue.s) {
                this.closeForm();
            }
        };
        return EditMemberContainerForm;
    }(TreeForm));
    exports.EditMemberContainerForm = EditMemberContainerForm;
    var EditMemberForm = (function (_super) {
        __extends(EditMemberForm, _super);
        function EditMemberForm() {
            _super.apply(this, arguments);
            this.tid = 'editMemberForm';
        }
        EditMemberForm.prototype.build = function (member) {
            this.member = member;
            this._formContextData = {
                name: member.getName(),
                types: exports.valueTypes,
                selectedType: member.v.type,
                dflt: null
            };
            _super.prototype._build.call(this);
            this.form.find('select[name=memberType]').focus();
        };
        EditMemberForm.prototype.updateMember = function (event) {
            var objectValue = this.member.getParent();
            var oldName = this.member.getName();
            var oldType = this.member.getType();
            var newNameInput = this.form.find('input[name=memberName]');
            var newName = newNameInput.val();
            if (newName && !/[^\w-]/.test(newName)) {
                var newType = this.form.find('select[name=memberType]').val();
                if (oldName !== newName) {
                    objectValue.renameMember(oldName, newName);
                }
                if (oldType !== newType) {
                    this.member.setType(newType);
                }
                this.closeForm();
            }
            else {
                newNameInput.focus();
            }
        };
        EditMemberForm.prototype.deleteMember = function (event) {
            var data = event.data;
            var member = data.member;
            var name = member.getName();
            var objectValue = member.getParent();
            objectValue.removeMember(name);
            this.closeForm();
        };
        return EditMemberForm;
    }(TreeForm));
    exports.EditMemberForm = EditMemberForm;
    var SwitchTypeForm = (function (_super) {
        __extends(SwitchTypeForm, _super);
        function SwitchTypeForm() {
            _super.apply(this, arguments);
            this.tid = 'switchTypeForm';
        }
        SwitchTypeForm.prototype.build = function (value) {
            this.value = value;
            this._formContextData = {
                types: exports.valueTypes,
                selectedType: 'o',
                dflt: null
            };
            _super.prototype._build.call(this);
            this.form.find('select[name=valueType]').focus();
        };
        SwitchTypeForm.prototype.updateValue = function (event) {
            var container = this.state.hash.getNode(this.value.e.parentElement);
            var oldType = this.value.getDisplayValue();
            var newType = this.form.find('select[name=valueType]').val();
            if (oldType !== newType) {
                container.setType(newType);
            }
            this.closeForm();
        };
        return SwitchTypeForm;
    }(TreeForm));
    exports.SwitchTypeForm = SwitchTypeForm;
    var EditableValueForm = (function (_super) {
        __extends(EditableValueForm, _super);
        function EditableValueForm() {
            _super.apply(this, arguments);
            this.tid = 'editableValueForm';
        }
        EditableValueForm.prototype.build = function (value) {
            this.value = value;
            this._formContextData = {
                value: value.getDisplayValue()
            };
            _super.prototype._build.call(this);
            this.form.find('input[name=value]').focus();
        };
        EditableValueForm.prototype.updateValue = function (event) {
            var oldValue = this.value.getDisplayValue();
            var newValue = this.form.find('input[name=value]').val();
            if (oldValue !== newValue) {
                this.value.setValue(newValue);
            }
            this.closeForm();
        };
        return EditableValueForm;
    }(TreeForm));
    exports.EditableValueForm = EditableValueForm;
    var StartTreeForm = (function (_super) {
        __extends(StartTreeForm, _super);
        function StartTreeForm() {
            _super.apply(this, arguments);
            this.tid = 'startTreeForm';
        }
        StartTreeForm.prototype.build = function () {
            this._formContextData = {
                types: exports.complexTypes,
                selectedType: 'o',
                dflt: null
            };
            _super.prototype._build.call(this);
        };
        StartTreeForm.prototype.createRoot = function (event) {
            var type = this.form.find('select[name=rootType]').val();
            var value = this.state.factory(type);
            this.state.rootValue = value;
            this.state.rootElement = value.e;
            this.state.treeBase.appendChild(this.state.rootValue.e);
            this.closeForm();
        };
        return StartTreeForm;
    }(TreeForm));
    exports.StartTreeForm = StartTreeForm;
});
