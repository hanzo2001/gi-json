var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./ValueContainer", "./Utils", "./MemberName"], function (require, exports, ValueContainer_1, Utils_1, MemberName_1) {
    "use strict";
    var Member = (function (_super) {
        __extends(Member, _super);
        function Member(h, name, input, f) {
            _super.call(this);
            this.f = f;
            var e = this._init(h, input);
            if (input instanceof HTMLElement) {
                this.n = new MemberName_1.MemberName(h, e.firstChild);
            }
            else {
                this.n = new MemberName_1.MemberName(h, name);
                this._append(this.n, this.v);
            }
        }
        Member.prototype.getName = function () {
            return this.n.name;
        };
        Member.prototype.setName = function (name) {
            this.n.setName(name);
        };
        Member.prototype.toString = function () {
            return '"' + Utils_1.ElementParser.str2json(this.n + '') + '":' + this.v;
        };
        Member.prototype._init = function (h, input) {
            var e;
            if (input instanceof HTMLElement) {
                e = _super.prototype._init.call(this, h, input);
                this.v = this.f.createValue(e.lastChild);
            }
            else {
                e = _super.prototype._init.call(this, h, 'member');
                this.v = this.f.createValue(input);
                this._append(this.v);
            }
            return e;
        };
        return Member;
    }(ValueContainer_1.ValueContainer));
    exports.Member = Member;
});
