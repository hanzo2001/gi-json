/// <reference path="../typings/index.d.ts" />

import * as $ from "jquery";

export class Tab implements iTab {
	id: number;
	head: HTMLElement;
	body: HTMLElement;
	title: HTMLElement;
	button: HTMLElement;
	state: iTreeState;
	constructor(id: number, head: HTMLElement, title: HTMLElement, button: HTMLElement, body: HTMLElement) {
		this.id = id;
		this.head = head;
		this.body = body;
		this.title = title;
		this.button = button;
	}
	renameTab(title: string) {
		this.title.innerHTML = title;
	}
	blurTab() {
		$(this.head).addClass('hidden');
		$(this.body).addClass('hidden');
	}
	focusTab() {
		$(this.head).removeClass('hidden');
		$(this.body).removeClass('hidden');
	}
	closeTab() {
		$(this.head).remove();
		$(this.body).remove();
		this.head = this.body = this.title = this.button = null;
		this.state = null;
	}
	getTitle(): string {
		return this.title.innerHTML;
	}
}
