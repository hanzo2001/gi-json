/// <reference path="../typings/index.d.ts" />

import {ValueContainer} from "./ValueContainer";

export class Item extends ValueContainer implements iItem {
	constructor(h: iNodeHash, input: HTMLElement|ValueType, f: iNodeEngine) {
		super();
		this.f = f;
		this._init(h,input);
	}
	getIndex(): number {
		let i: number = 0;
		let c: Element = this.e;
		while( (c = c.previousElementSibling) != null ) {i++;}
		return i;
	}
	protected _init(h: iNodeHash, input: HTMLElement|ValueType) {
		let e: HTMLElement;
		if (input instanceof HTMLElement) {
			e = super._init(h,input);
			this.v = this.f.createValue(<HTMLElement>e.firstChild);
		} else {
			e = super._init(h,'item');
			this.v = this.f.createValue(input);
			this._append(this.v);
		}
		return e;
	}
}
