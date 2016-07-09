var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "jquery", "./NodeEngine", "handlebars", "helpers"], function (require, exports, $, NodeEngine_1, Handlebars) {
    "use strict";
    var rootElement;
    var treeRoot;
    var debug;
    var data = { active: true };
    var showTemplate;
    var state = {
        formBase: null,
        treeBase: null,
        rootElement: null,
        rootValue: null,
        controlForm: null,
        clickEventsAllowed: false,
        blockClicks: function () {
            this.clickEventsAllowed = false;
        },
        allowClicks: function () {
            this.clickEventsAllowed = true;
        }
    };
    showTemplate = (function (state) {
        var cache = {};
        return function (id, target, data) {
            var html;
            var script = cache[id];
            if (!script) {
                cache[id] = script = Handlebars.compile($('#' + id).html());
            }
            html = $(script(data));
            $(target).append(html);
            state.blockClicks(function () { html.remove(); });
            return html;
        };
    }(state));
    var Nodes = NodeEngine_1.NodeEngine.generate();
    var Hash = Nodes.hash;
    var primitiveTypes = {
        u: 'null',
        s: 'string',
        b: 'bool',
        n: 'number',
    };
    var complexTypes = {
        a: 'array',
        o: 'object'
    };
    var valueTypes = $.extend(Object.create(null), primitiveTypes, complexTypes);
    var factory = Nodes.factory;
    function clickMember(event) {
        event.stopPropagation();
        var memberElement = this;
        var state = event.data;
        var controlForm = state.controlForm;
        if (controlForm) {
            controlForm.closeForm();
        }
        controlForm = new EditMemberContainerForm(state);
        controlForm.build(Hash.getNode(memberElement));
        state.controlForm = controlForm;
    }
    function clickItem(event) {
        event.stopPropagation();
        var itemElement = this;
        var state = event.data;
        var controlForm = state.controlForm;
        if (controlForm) {
            controlForm.closeForm();
        }
        controlForm = new EditItemContainerForm(state);
        controlForm.build(Hash.getNode(itemElement));
        state.controlForm = controlForm;
    }
    function clickName(event) {
        event.stopPropagation();
        var name = this;
        var member = name.parentElement;
        var controlForm = state.controlForm;
        if (controlForm) {
            controlForm.closeForm();
        }
        controlForm = new EditMemberForm(state);
        controlForm.build(Hash.getNode(member));
        state.controlForm = controlForm;
    }
    function clickValue(event) {
        event.stopPropagation();
        var valueElement = this;
        var controlForm = state.controlForm;
        if (controlForm) {
            controlForm.closeForm();
        }
        state.controlForm = controlForm = null;
        var value = Hash.getNode(valueElement);
        var type = value.type;
        switch (type) {
            case 'u':
                controlForm = new SwitchTypeForm(state);
                break;
            case 'b':
                toggleBoolValue(value);
                break;
            case 's':
                controlForm = new EditableValueForm(state);
                break;
            case 'n':
                controlForm = new EditableValueForm(state);
                break;
            case 'o':
                controlForm = new AddMemberForm(state);
                break;
            case 'a':
                controlForm = new AddItemForm(state);
                break;
        }
        state.controlForm = controlForm;
        controlForm && controlForm.build(value);
    }
    function toggleBoolValue(value) {
        value.setValue(!value.getValue());
    }
    function loadEditValueForm(value) {
        var type = value.type;
        switch (type) {
            case 'u': return (new SwitchTypeForm(state)).build(value);
            case 'b': return toggleBoolValue(value);
            case 's': return (new EditableValueForm(state)).build(value);
            case 'n': return (new EditableValueForm(state)).build(value);
            case 'o': return (new AddMemberForm(state)).build(value);
            case 'a': return (new AddItemForm(state)).build(value);
        }
    }
    var TreeNodeForm = (function () {
        function TreeNodeForm(state) {
            this.tid = '';
            this._buttons = {};
            this._keyCodes = {};
            this._sid = 0;
            this.state = state;
        }
        TreeNodeForm.prototype.build = function (o) { };
        TreeNodeForm.prototype._build = function () {
            this.state.controlForm = this;
            this.form = showTemplate(this.tid, this.state.formBase, this._formContextData);
            var behaviors = this.form.data('behavior');
            if (behaviors) {
                behaviors.split(' ').forEach(function (mth) { this[mth](); }, this);
            }
            var buttons = this.form.find('button[data-action]');
            buttons.each(this._attachButtonEvent.bind(this));
            this._attachKeyboardShortcuts();
        };
        TreeNodeForm.prototype.closeForm = function () {
            if (this._sid) {
                $(document).off('keyup.' + this.tid);
            }
            this.state.controlForm = null;
            this.form.remove();
            this.allowClicks();
        };
        TreeNodeForm.prototype.blockClicks = function () {
            this.state.blockClicks();
        };
        TreeNodeForm.prototype.allowClicks = function () {
            this.state.allowClicks();
        };
        TreeNodeForm.prototype._attachButtonEvent = function (i, button) {
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
        TreeNodeForm.prototype._attachKeyboardShortcuts = function () {
            if (this._sid) {
                var data_1 = {
                    k: this._keyCodes,
                    b: this._buttons
                };
                $(document).on('keyup.' + this.tid, data_1, function (event) {
                    var data = event.data;
                    var id = data.k[event.keyCode];
                    id && $(data.b[id]).click();
                });
            }
        };
        return TreeNodeForm;
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
                types: valueTypes,
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
    }(TreeNodeForm));
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
                        a[i] = valueTypes[items[i].getType()];
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
    }(TreeNodeForm));
    var AddMemberForm = (function (_super) {
        __extends(AddMemberForm, _super);
        function AddMemberForm() {
            _super.apply(this, arguments);
            this.tid = 'addMemberForm';
        }
        AddMemberForm.prototype.build = function (objectValue) {
            this.objectValue = objectValue;
            this._formContextData = {
                types: valueTypes,
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
    }(TreeNodeForm));
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
    }(TreeNodeForm));
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
                types: valueTypes,
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
    }(TreeNodeForm));
    var SwitchTypeForm = (function (_super) {
        __extends(SwitchTypeForm, _super);
        function SwitchTypeForm() {
            _super.apply(this, arguments);
            this.tid = 'switchTypeForm';
        }
        SwitchTypeForm.prototype.build = function (value) {
            this.value = value;
            this._formContextData = {
                types: valueTypes,
                selectedType: 'o',
                dflt: null
            };
            _super.prototype._build.call(this);
            this.form.find('select[name=valueType]').focus();
        };
        SwitchTypeForm.prototype.updateValue = function (event) {
            var container = Hash.getNode(this.value.e.parentElement);
            var oldType = this.value.getDisplayValue();
            var newType = this.form.find('select[name=valueType]').val();
            if (oldType !== newType) {
                container.setType(newType);
            }
            this.closeForm();
        };
        return SwitchTypeForm;
    }(TreeNodeForm));
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
    }(TreeNodeForm));
    var StartTreeForm = (function (_super) {
        __extends(StartTreeForm, _super);
        function StartTreeForm() {
            _super.apply(this, arguments);
            this.tid = 'startTreeForm';
        }
        StartTreeForm.prototype.build = function () {
            this._formContextData = {
                types: complexTypes,
                selectedType: 'o',
                dflt: null
            };
            _super.prototype._build.call(this);
        };
        StartTreeForm.prototype.createRoot = function (event) {
            var type = this.form.find('select[name=rootType]').val();
            var value = factory(type);
            this.state.rootValue = value;
            this.state.rootElement = value.e;
            this.state.treeBase.appendChild(state.rootValue.e);
            this.closeForm();
        };
        return StartTreeForm;
    }(TreeNodeForm));
    $(function () {
        try {
            state.treeBase = document.getElementById('treeBase');
            state.formBase = document.getElementById('formBase');
            state.rootElement = state.treeBase.childNodes.item(1);
            if (state.rootElement) {
                state.rootValue = factory(state.rootElement);
            }
            else {
                (new StartTreeForm(state)).build();
            }
            $(state.treeBase)
                .on('click', 'member', state, clickMember)
                .on('click', 'item', state, clickItem)
                .on('click', 'name', state, clickName)
                .on('click', 'value', state, clickValue);
            $('#outputJSON')
                .click(state, function (event) {
                if (event.data.rootValue) {
                    $('#jsonOutput').text(event.data.rootValue + '');
                }
            });
            window.t = state.rootValue;
        }
        catch (e) {
            console.log(e);
        }
    });
});
