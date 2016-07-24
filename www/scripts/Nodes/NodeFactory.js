define(["require", "exports", './Values/NullValue', './Values/StringValue', './Values/BoolValue', './Values/NumberValue', './Values/ArrayValue', './Values/ObjectValue'], function (require, exports, NullValue_1, StringValue_1, BoolValue_1, NumberValue_1, ArrayValue_1, ObjectValue_1) {
    "use strict";
    var NodeFactory = (function () {
        function NodeFactory() {
        }
        NodeFactory.prototype.create = function (hash, input) {
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
                    o = new NullValue_1.NullValue(hash, e);
                    break;
                case 's':
                    o = new StringValue_1.StringValue(hash, e);
                    break;
                case 'b':
                    o = new BoolValue_1.BoolValue(hash, e);
                    break;
                case 'n':
                    o = new NumberValue_1.NumberValue(hash, e);
                    break;
                case 'a':
                    o = new ArrayValue_1.ArrayValue(hash, e, this);
                    break;
                case 'o':
                    o = new ObjectValue_1.ObjectValue(hash, e, this);
                    break;
            }
            return o;
        };
        return NodeFactory;
    }());
    exports.NodeFactory = NodeFactory;
});
