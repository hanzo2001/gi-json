///<reference path="../typings/index.d.ts" />

import * as $ from 'jquery';

export class KbsRegistry implements iKbsRegistry {
	protected state: iTreeState;
	protected shortcuts: ShortcutEventCallbackHash;
	protected callback: ShortcutEventCallback;
	protected listening: boolean;
	constructor() {
		this.clear();
		this.callback = (this.keyupEvent).bind(this);
	}
	link(state: iTreeState) {
		this.state = state;
	}
	listen() {
		if (!this.listening) {
			this.listening = true;
			$(document).on('keyup',this.state,this.callback);
		}
	}
	ignore() {
		if (this.listening) {
			this.listening = false;
			$(document).off('keyup',this.callback);
		}
	}
	register(keyCode: number, cb: ShortcutEventCallback) {
		let shortcuts = this.shortcuts[keyCode];
		if (!shortcuts) {this.shortcuts[keyCode] = shortcuts = [];}
		shortcuts.push(cb);
	}
	unregister(keyCode: number): ShortcutEventCallback[] {
		let shortcut = this.shortcuts[keyCode] || null;
		delete this.shortcuts[keyCode];
		return shortcut;
	}
	clear(): ShortcutEventCallbackHash {
		let shortcuts = this.shortcuts;
		this.shortcuts = Object.create(null);
		return shortcuts;
	}
	unclear(shortcuts: ShortcutEventCallbackHash): ShortcutEventCallbackHash {//optimization
		let oldShortcuts = this.shortcuts;
		this.shortcuts = shortcuts;
		return oldShortcuts;
	}
	protected keyupEvent(event: JQueryEventObject): void {
		if (this.listening) {
			let cbs = this.shortcuts[event.keyCode];
			if (cbs) {
				let i=0, s=cbs.length;
				while (i<s) {cbs[i++](event);}
			}
		}
	}
}
