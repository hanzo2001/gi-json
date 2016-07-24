/// <reference path="../typings/index.d.ts" />

export class TabSpace implements iTabSpace {
	header: HTMLElement;
	button: HTMLElement;
	container: HTMLElement;
	constructor(hE, bE, cE) {
		this.header = hE;
		this.button = bE;
		this.container = cE;
	}
	addTab(tab: iTab): iTab {
		this.header.insertBefore(tab.head,this.button);
		this.container.appendChild(tab.body);
		return tab;
	}
}
	