/// <reference path="../typings/iElementRegistry.d.ts" />

interface iElementContainer {
	e: HTMLElement;
}

export class ElementRegistry<T extends iElementContainer> implements iElementRegistry<T> {
	private i: ()=>number;
	private h: {[id:number]:T};
	private d: string;
	constructor(idGenerator: ()=>number, dataName: string) {
		this.i = idGenerator;
		this.h = Object.create(null);
		this.d = dataName;
	}
	isRegistered(e: HTMLElement) {
		let id: number = ~~e.dataset[this.d] || 0;
		return id && !!this.h[id];
	}
	get(e: HTMLElement): T {
		let id: number = ~~e.dataset[this.d];
		return this.h[id] || null;
	}
	register(value: T): number {
		let id: number = this.i();
		this.h[id] = value;
		value.e.dataset[this.d] = id+'';
		return id;
	}
	unregister(e: HTMLElement): HTMLElement {
		let id: number = ~~e.dataset[this.d] || 0;
		if (id && this.h[id]) {
			delete this.h[id];
			delete e.dataset[this.d];
		}
		return e;
	}
}
