define(["require", "exports", 'jquery'], function (require, exports, $) {
    "use strict";
    var KeyboardShortcutRegistry = (function () {
        function KeyboardShortcutRegistry(element) {
            this.element = element;
            this.shortcuts = {};
            this.keyupCallback = this.keyupEvent.bind(this);
            this.listening = false;
        }
        KeyboardShortcutRegistry.prototype.registerShortcut = function (keyCode, cb) {
            if (!this.shortcuts[keyCode]) {
                this.shortcuts[keyCode] = [];
            }
            this.shortcuts[keyCode].push(cb);
            if (!this.listening) {
                $(this.element).on('keyup', this.keyupCallback);
                this.listening = true;
            }
        };
        KeyboardShortcutRegistry.prototype.unregisterShortcut = function (keyCode) {
            if (keyCode === undefined) {
                $(this.element).off('keyup', this.keyupCallback);
                this.listening = false;
                var shorts = this.shortcuts;
                this.shortcuts = {};
                return shorts;
            }
            else {
                var cb = this.shortcuts[keyCode] || null;
                delete this.shortcuts[keyCode];
                return cb;
            }
        };
        KeyboardShortcutRegistry.prototype.keyupEvent = function (event) {
            var i = 0;
            var cbs = this.shortcuts[event.keyCode];
            if (cbs) {
                var s = cbs.length;
                while (i < s) {
                    cbs[i++](event);
                }
            }
        };
        return KeyboardShortcutRegistry;
    }());
    exports.KeyboardShortcutRegistry = KeyboardShortcutRegistry;
});
