///<reference path="../typings/iTab.d.ts" />

export class TabManager implements iTabManager {
	protected h: HTMLElement;
	protected c: HTMLElement;
	protected b: HTMLElement;
	constructor(h: HTMLElement, c: HTMLElement) {
		this.h = h;
		this.c = c;
		this.b = <HTMLElement>h.lastChild;
	}
	appendTab(tab: iTab) {
		this.h.insertBefore(tab.head[0],this.b);
		this.c.appendChild(tab.body[0]);
	}
	removeTab(tab: iTab) {
		tab.head.remove();
		tab.body.remove();
	}
}
