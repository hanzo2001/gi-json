/// <reference path="../typings/index.d.ts" />

export class NodeHash implements iNodeHash {
	private i: number = 0;
	private h: {[id:number]:iValue} = {};
	isRegistered(e: HTMLElement) {
		let id: number = ~~e.dataset['nid'] || 0;
		return id && !!this.h[id];
	}
	getNode(e: HTMLElement): iValue {
		let id: number = ~~e.dataset['nid'];
		return this.h[id] || null;
	}
	register(value: iValue): number {
		let id: number = ++this.i;
		this.h[id] = value;
		value.e.dataset['nid'] = id+'';
		return id;
	}
	unregister(e: HTMLElement): HTMLElement {
		let id: number = ~~e.dataset['nid'] || 0;
		if (id && this.h[id]) {
			delete this.h[id];
			delete e.dataset['nid'];
		}
		return e;
	}
}
