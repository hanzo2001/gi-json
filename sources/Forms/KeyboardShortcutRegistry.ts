///<reference path="../typings/iKeyboardShortcutRegistry.d.ts" />

import * as $ from 'jquery';

export class KeyboardShortcutRegistry implements iKeyboardShortcutRegistry {
	protected element: Node;
	protected shortcuts: ShortcutEventCallbackHash;
	protected keyupCallback: (e: JQueryEventObject) => void;
	protected listening: boolean;
	constructor(element: Node) {
		this.element = element;
		this.shortcuts = {};
		this.keyupCallback = this.keyupEvent.bind(this);
		this.listening = false;
	}
	registerShortcut(keyCode: number, cb: ShortcutEventCallback) {
		if (!this.shortcuts[keyCode]) {this.shortcuts[keyCode] = [];}
		this.shortcuts[keyCode].push(cb);
		if (!this.listening) {
			$(this.element).on('keyup',this.keyupCallback);
			this.listening = true;
		}
	}
	unregisterShortcut(keyCode?: number): ShortcutEventCallback[] | ShortcutEventCallbackHash {
		if (keyCode === undefined) {
			$(this.element).off('keyup',this.keyupCallback);
			this.listening = false;
			let shorts = this.shortcuts;
			this.shortcuts = {};
			return shorts;
		} else {
			// i dont know if I should stop listening when there all gone!
			let cb = this.shortcuts[keyCode] || null;
			delete this.shortcuts[keyCode];
			return cb;
		}
	}
	protected keyupEvent(event: JQueryEventObject): void {
		let i: number = 0;
		let cbs = this.shortcuts[event.keyCode];
		if (cbs) {
			let s = cbs.length;
			while (i < s) {cbs[i++](event);}
		}
	}
}
