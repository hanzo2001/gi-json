var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'NodeEngineUtils'], function (require, exports, NodeEngineUtils_1) {
    "use strict";
    var ProtoBase = (function () {
        function ProtoBase() {
        }
        ProtoBase.prototype.getParent = function () {
            var parent = this._h.getNode(this.e.parentElement);
            return parent;
        };
        ProtoBase.prototype.getNodeId = function () {
            return this.id;
        };
        ProtoBase.prototype._remove = function (unlink) {
            var e = this.e;
            this.e = null;
            if (unlink) {
                e.parentNode.removeChild(e);
                this._h.unregister(e);
                this._h = null;
            }
            return e;
        };
        ProtoBase.prototype._init = function (h, input) {
            this._h = h;
            if (input instanceof HTMLElement) {
                this.e = input;
            }
            else {
                this.e = document.createElement(input);
            }
            this.id = this._h.register(this);
            return this.e;
        };
        ProtoBase.prototype._append = function (c, b) {
            this.e.insertBefore(c.e, b ? b.e : null);
        };
        return ProtoBase;
    }());
    var Value = (function (_super) {
        __extends(Value, _super);
        function Value() {
            _super.apply(this, arguments);
        }
        Value.prototype.getParentContainer = function () {
            var parentTag = this.e.parentElement.tagName;
            return parentTag === 'ITEM' || parentTag === 'MEMBER' ? this.getParent() : null;
        };
        Value.prototype.isEmpty = function () {
            return this.e.innerHTML === '&nbsp;';
        };
        Value.prototype.isEditable = function () {
            return false;
        };
        Value.prototype.isComplex = function () {
            return false;
        };
        Value.prototype.getValue = function () {
            return this.value;
        };
        Value.prototype.getDisplayValue = function () {
            return '';
        };
        Value.prototype.setValue = function (value) { };
        Value.prototype.resetValue = function () {
            this._defaultValue(this.e);
            return this.e;
        };
        Value.prototype._init = function (h, input) {
            var e;
            var type;
            if (input instanceof HTMLElement) {
                e = _super.prototype._init.call(this, h, input);
                this.type = e.dataset['t'];
                this.value = this._extractValue(e);
            }
            else {
                e = _super.prototype._init.call(this, h, 'value');
                e.dataset['t'] = input;
                this.type = input;
                this.value = this._defaultValue(e);
            }
            return e;
        };
        Value.prototype._defaultValue = function (e) {
            e.innerHTML = '&nbsp;';
            return null;
        };
        Value.prototype._extractValue = function (e) {
            return null;
        };
        return Value;
    }(ProtoBase));
    var NullValue = (function (_super) {
        __extends(NullValue, _super);
        function NullValue(h, e) {
            _super.call(this);
            this._init(h, e || 'u');
        }
        NullValue.prototype.toString = function () {
            return 'null';
        };
        return NullValue;
    }(Value));
    var StringValue = (function (_super) {
        __extends(StringValue, _super);
        function StringValue(h, e) {
            _super.call(this);
            this._init(h, e || 's');
        }
        StringValue.prototype.isEditable = function () {
            return true;
        };
        StringValue.prototype.getDisplayValue = function () {
            return this.e.innerHTML === '&nbsp;' ? '' : this.e.innerHTML;
        };
        StringValue.prototype.setValue = function (value) {
            if (value === '') {
                this._defaultValue(this.e);
            }
            else {
                this.value = this.e.innerHTML = value;
            }
        };
        StringValue.prototype.toString = function () {
            return '"' + this.value.replace('"', '\\"') + '"';
        };
        StringValue.prototype._defaultValue = function (e) {
            e.innerHTML = '&nbsp;';
            return '';
        };
        StringValue.prototype._extractValue = function (e) {
            var value = e.innerHTML;
            if (value === '') {
                this.e.innerHTML = '&nbsp;';
            }
            return value === '&nbsp;' ? '' : value;
        };
        return StringValue;
    }(Value));
    var BoolValue = (function (_super) {
        __extends(BoolValue, _super);
        function BoolValue(h, e) {
            _super.call(this);
            this._init(h, e || 'b');
        }
        BoolValue.prototype.getDisplayValue = function () {
            return this.e.innerHTML;
        };
        BoolValue.prototype.setValue = function (input) {
            if (typeof (input) === 'string') {
                this.value = NodeEngineUtils_1.ElementParser.parseBool(input);
            }
            else {
                this.value = !!input;
            }
            this.e.innerHTML = this.value ? 'true' : 'false';
        };
        BoolValue.prototype.toString = function () {
            return this.e.innerHTML;
        };
        BoolValue.prototype._defaultValue = function (e) {
            e.innerHTML = 'false';
            return false;
        };
        BoolValue.prototype._extractValue = function (e) {
            var value = NodeEngineUtils_1.ElementParser.parseBool(e.innerHTML);
            e.innerHTML = value ? 'true' : 'false';
            return value;
        };
        return BoolValue;
    }(Value));
    var NumberValue = (function (_super) {
        __extends(NumberValue, _super);
        function NumberValue(h, e) {
            _super.call(this);
            this._init(h, e || 'n');
        }
        NumberValue.prototype.getDisplayValue = function () {
            return this.e.innerHTML;
        };
        NumberValue.prototype.setValue = function (input) {
            this.value = NodeEngineUtils_1.ElementParser.parseNumber(input);
            if (isNaN(this.value)) {
                this.value = this._defaultValue(this.e);
            }
            else {
                this.e.innerHTML = input;
            }
        };
        NumberValue.prototype.isEditable = function () {
            return true;
        };
        NumberValue.prototype.toString = function () {
            return this.e.innerHTML;
        };
        NumberValue.prototype._defaultValue = function (e) {
            e.innerHTML = '0';
            return 0;
        };
        NumberValue.prototype._extractValue = function (e) {
            var value = NodeEngineUtils_1.ElementParser.parseNumber(e.innerHTML);
            if (isNaN(value)) {
                return this._defaultValue(e);
            }
            return value;
        };
        return NumberValue;
    }(Value));
    var ArrayValue = (function (_super) {
        __extends(ArrayValue, _super);
        function ArrayValue(h, e) {
            _super.call(this);
            this.items = [];
            this.s = 0;
            this._init(h, e || 'a');
        }
        ArrayValue.prototype.isComplex = function () {
            return true;
        };
        ArrayValue.prototype.getItem = function (index) {
            return this.items[index] || null;
        };
        ArrayValue.prototype.getItemValue = function (index) {
            return this.items[index] ? this.items[index].v : null;
        };
        ArrayValue.prototype.addItem = function (type, offset) {
            if (offset === undefined || offset > this.s) {
                offset = this.s;
            }
            else if (offset < 0) {
                if (!this.s) {
                    offset = 0;
                }
                while (offset < 0) {
                    offset += this.s;
                }
            }
            var item = new Item(this._h, type);
            var refItem = this.items[offset] || null;
            this.items.splice(offset, 0, item);
            if (this.isEmpty()) {
                NodeEngineUtils_1.clearTextNodes(this.e);
            }
            this._append(item, refItem);
            this.s++;
            return item.v;
        };
        ArrayValue.prototype.addItems = function (amount, type, offset) {
            if (offset === undefined || offset > this.s) {
                offset = this.s;
            }
            else if (offset < 0) {
                if (!this.s) {
                    offset = 0;
                }
                while (offset < 0) {
                    offset += this.s;
                }
            }
            var a = [];
            var item;
            var refItem = this.items[offset] || null;
            if (amount && this.isEmpty()) {
                NodeEngineUtils_1.clearTextNodes(this.e);
            }
            while (amount--) {
                item = new Item(this._h, type);
                a.push(item.v);
                this.items.splice(offset++, 0, item);
                this._append(item, refItem);
            }
            this.s += a.length;
            return a;
        };
        ArrayValue.prototype.removeItem = function (index) {
            var item = this.items[index];
            if (item) {
                item._remove(true);
                this.items.splice(index, 1);
                this.s--;
                if (!this.s) {
                    this._defaultValue(this.e);
                }
            }
        };
        ArrayValue.prototype.empty = function () {
            var i = this.s;
            while (i--) {
                this.e.removeChild(this.items[i]._remove(true));
            }
            this.s = 0;
            this.items = [];
            this._defaultValue(this.e);
        };
        ArrayValue.prototype.first = function () {
            return this.items[0] || null;
        };
        ArrayValue.prototype.last = function () {
            return this.items[this.s - 1] || null;
        };
        ArrayValue.prototype._remove = function (unlink) {
            var i = this.s;
            while (i--) {
                this.items[i]._remove(unlink);
            }
            return _super.prototype._remove.call(this, unlink);
        };
        ArrayValue.prototype.toString = function () {
            var r = '', i = 0;
            if (this.s) {
                r += this.items[i++].v + '';
                for (; i < this.s; i++) {
                    r += ',' + this.items[i].v;
                }
            }
            return '[' + r + ']';
        };
        ArrayValue.prototype._extractValue = function (arrayElement) {
            NodeEngineUtils_1.clearTextNodes(arrayElement);
            Array.prototype.forEach.call(arrayElement.childNodes, function (itemElement) {
                var item = new Item(this._h, itemElement);
                this.items.push(item);
                this.s++;
            }, this);
            return null;
        };
        return ArrayValue;
    }(Value));
    var ObjectValue = (function (_super) {
        __extends(ObjectValue, _super);
        function ObjectValue(h, e) {
            _super.call(this);
            this.members = NodeEngineUtils_1.nullO();
            this.s = 0;
            this._init(h, e || 'o');
        }
        ObjectValue.prototype.isComplex = function () {
            return true;
        };
        ObjectValue.prototype.getMember = function (name) {
            return this.members[name] || null;
        };
        ObjectValue.prototype.getMemberValue = function (name) {
            return this.members[name] ? this.members[name].v : null;
        };
        ObjectValue.prototype.getMemberNames = function () {
            var i;
            var a = [];
            for (i in this.members) {
                a.push(i);
            }
            return a;
        };
        ObjectValue.prototype.addMember = function (name, type) {
            var member = this.members[name];
            if (!member) {
                member = new Member(this._h, name, type);
                this.members[name] = member;
                if (!this.s) {
                    NodeEngineUtils_1.clearTextNodes(this.e);
                }
                this._append(member);
                this.s++;
            }
            return member ? member.v : null;
        };
        ObjectValue.prototype.removeMember = function (name) {
            var member = this.members[name];
            if (member) {
                var e = member._remove(true);
                delete this.members[name];
                this.s--;
                if (!this.s) {
                    this._defaultValue(this.e);
                }
            }
        };
        ObjectValue.prototype.renameMember = function (oldName, newName) {
            var member = this.members[oldName];
            if (member && !this.members[newName]) {
                member.setName(newName);
                this.members[newName] = member;
                delete this.members[oldName];
            }
        };
        ObjectValue.prototype.empty = function () {
            var i;
            for (i in this.members) {
                this.members[i]._remove(true);
                delete this.members[i];
            }
            this.s = 0;
            this._defaultValue(this.e);
        };
        ObjectValue.prototype.first = function () {
            var e = this.e.firstElementChild;
            var c = e ? this._h.getNode(e) : null;
            return c || null;
        };
        ObjectValue.prototype.last = function () {
            var e = this.e.lastElementChild;
            var c = e ? this._h.getNode(e) : null;
            return c || null;
        };
        ObjectValue.prototype.toString = function () {
            var r = '', i = 0, k;
            if (this.s) {
                for (k in this.members) {
                    r += (i ? ',' : '') + '"' + this.members[k].getName() + '":' + this.members[k].v;
                    i++;
                }
            }
            return '{' + r + '}';
        };
        ObjectValue.prototype._remove = function (unlink) {
            var i;
            for (i in this.members) {
                this.members[i]._remove(unlink);
                delete this.members[i];
            }
            return _super.prototype._remove.call(this, unlink);
        };
        ObjectValue.prototype._extractValue = function (objectElement) {
            NodeEngineUtils_1.clearTextNodes(objectElement);
            Array.prototype.forEach.call(objectElement.childNodes, function (memberElement) {
                var name = memberElement.firstElementChild.innerHTML;
                var member = new Member(this._h, name, memberElement);
                this.members[name] = member;
                this.s++;
            }, this);
            return null;
        };
        return ObjectValue;
    }(Value));
    var ValueContainer = (function (_super) {
        __extends(ValueContainer, _super);
        function ValueContainer() {
            _super.apply(this, arguments);
        }
        ValueContainer.prototype.getParentValue = function () {
            return this.getParent();
        };
        ValueContainer.prototype.getType = function () {
            return this.v.type;
        };
        ValueContainer.prototype.setType = function (type) {
            this.v._remove(true);
            this.v = NodeEngine(this._h, type);
            this._append(this.v);
            return this.v;
        };
        ValueContainer.prototype.prev = function () {
            var e = this.e.previousElementSibling;
            var c = e ? this._h.getNode(e) : null;
            return c;
        };
        ValueContainer.prototype.next = function () {
            var e = this.e.nextElementSibling;
            var c = e ? this._h.getNode(e) : null;
            return c;
        };
        ValueContainer.prototype._remove = function (unlink) {
            var e = this.v._remove(unlink);
            this.v = null;
            return _super.prototype._remove.call(this, unlink);
        };
        return ValueContainer;
    }(ProtoBase));
    var Item = (function (_super) {
        __extends(Item, _super);
        function Item(h, input) {
            _super.call(this);
            this._init(h, input);
        }
        Item.prototype.getIndex = function () {
            var i = 0;
            var c = this.e;
            while ((c = c.previousElementSibling) != null) {
                i++;
            }
            return i;
        };
        Item.prototype._init = function (h, input) {
            var e;
            if (input instanceof HTMLElement) {
                e = _super.prototype._init.call(this, h, input);
                this.v = NodeEngine(h, e.firstChild);
            }
            else {
                e = _super.prototype._init.call(this, h, 'item');
                this.v = NodeEngine(h, input);
                this._append(this.v);
            }
            return e;
        };
        return Item;
    }(ValueContainer));
    var Member = (function (_super) {
        __extends(Member, _super);
        function Member(h, name, input) {
            _super.call(this);
            var e = this._init(h, input);
            if (input instanceof HTMLElement) {
                this.n = new MemberName(h, e.firstChild);
            }
            else {
                this.n = new MemberName(h, name);
                this._append(this.n, this.v);
            }
        }
        Member.prototype.getName = function () {
            return this.n.name;
        };
        Member.prototype.setName = function (name) {
            this.n.setName(name);
        };
        Member.prototype._init = function (h, input) {
            var e;
            if (input instanceof HTMLElement) {
                e = _super.prototype._init.call(this, h, input);
                this.v = NodeEngine(h, e.lastChild);
            }
            else {
                e = _super.prototype._init.call(this, h, 'member');
                this.v = NodeEngine(h, input);
                this._append(this.v);
            }
            return e;
        };
        return Member;
    }(ValueContainer));
    var MemberName = (function (_super) {
        __extends(MemberName, _super);
        function MemberName(h, input) {
            _super.call(this);
            if (input instanceof HTMLElement) {
                this._init(h, input);
                this.name = this.e.innerHTML;
            }
            else {
                this._init(h, 'name');
                this.name = this.e.innerHTML = input;
            }
        }
        MemberName.prototype.setName = function (name) {
            this.name = this.e.innerHTML = name;
        };
        return MemberName;
    }(ProtoBase));
    function NodeEngine(h, input) {
        var e = null;
        var type;
        var o;
        if (input instanceof HTMLElement) {
            e = input;
            type = e.dataset['t'];
        }
        else {
            type = input;
            if (!type) {
                type = 'u';
            }
        }
        switch (type) {
            case 'u':
                o = new NullValue(h, e);
                break;
            case 's':
                o = new StringValue(h, e);
                break;
            case 'b':
                o = new BoolValue(h, e);
                break;
            case 'n':
                o = new NumberValue(h, e);
                break;
            case 'a':
                o = new ArrayValue(h, e);
                break;
            case 'o':
                o = new ObjectValue(h, e);
                break;
        }
        return o;
    }
    exports.NodeEngine = NodeEngine;
});
