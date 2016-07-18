var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./ProtoBase", "./Utils"], function (require, exports, ProtoBase_1, Utils_1) {
    "use strict";
    var MemberName = (function (_super) {
        __extends(MemberName, _super);
        function MemberName(h, input) {
            _super.call(this);
            if (input instanceof HTMLElement) {
                this._init(h, input);
                this.name = Utils_1.ElementParser.html2str(this.e.innerHTML);
            }
            else {
                this._init(h, 'name');
                this.name = input;
                this.e.innerHTML = Utils_1.ElementParser.str2html(input);
            }
        }
        MemberName.prototype.setName = function (name) {
            this.name = this.e.innerHTML = name;
        };
        MemberName.prototype.toString = function () {
            return this.name;
        };
        return MemberName;
    }(ProtoBase_1.ProtoBase));
    exports.MemberName = MemberName;
});
