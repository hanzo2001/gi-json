var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./Value", "../Utils", "../Member"], function (require, exports, Value_1, Utils_1, Member_1) {
    "use strict";
    var ObjectValue = (function (_super) {
        __extends(ObjectValue, _super);
        function ObjectValue(h, e, f) {
            _super.call(this);
            this.members = Utils_1.nullO();
            this.s = 0;
            this.f = f;
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
                member = new Member_1.Member(this._h, name, type, this.f);
                this.members[name] = member;
                if (!this.s) {
                    Utils_1.clearTextNodes(this.e);
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
                    r += (i++ ? ',' : '') + this.members[k];
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
            Utils_1.clearTextNodes(objectElement);
            Array.prototype.forEach.call(objectElement.childNodes, function (memberElement) {
                var objectValue = this;
                var name = memberElement.firstElementChild.innerHTML;
                var member = new Member_1.Member(objectValue._h, name, memberElement, objectValue.f);
                this.members[name] = member;
                this.s++;
            }, this);
            return null;
        };
        return ObjectValue;
    }(Value_1.Value));
    exports.ObjectValue = ObjectValue;
});
