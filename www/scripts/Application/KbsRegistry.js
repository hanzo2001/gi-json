define(["require", "exports", 'jquery'], function (require, exports, $) {
    "use strict";
    var KbsRegistry = (function () {
        function KbsRegistry() {
            this.clear();
            this.callback = (this.keyupEvent).bind(this);
        }
        KbsRegistry.prototype.link = function (state) {
            this.state = state;
        };
        KbsRegistry.prototype.listen = function () {
            if (!this.listening) {
                this.listening = true;
                $(document).on('keyup', this.state, this.callback);
            }
        };
        KbsRegistry.prototype.ignore = function () {
            if (this.listening) {
                this.listening = false;
                $(document).off('keyup', this.callback);
            }
        };
        KbsRegistry.prototype.register = function (keyCode, cb) {
            var shortcuts = this.shortcuts[keyCode];
            if (!shortcuts) {
                this.shortcuts[keyCode] = shortcuts = [];
            }
            shortcuts.push(cb);
        };
        KbsRegistry.prototype.unregister = function (keyCode) {
            var shortcut = this.shortcuts[keyCode] || null;
            delete this.shortcuts[keyCode];
            return shortcut;
        };
        KbsRegistry.prototype.clear = function () {
            var shortcuts = this.shortcuts;
            this.shortcuts = Object.create(null);
            return shortcuts;
        };
        KbsRegistry.prototype.unclear = function (shortcuts) {
            var oldShortcuts = this.shortcuts;
            this.shortcuts = shortcuts;
            return oldShortcuts;
        };
        KbsRegistry.prototype.keyupEvent = function (event) {
            if (this.listening) {
                var cbs = this.shortcuts[event.keyCode];
                if (cbs) {
                    var i = 0, s = cbs.length;
                    while (i < s) {
                        cbs[i++](event);
                    }
                }
            }
        };
        return KbsRegistry;
    }());
    exports.KbsRegistry = KbsRegistry;
});
