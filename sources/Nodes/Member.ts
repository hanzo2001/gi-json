/// <reference path="../typings/index.d.ts" />

import {ValueContainer} from "./ValueContainer";
import {ElementParser} from "./Utils";
import {MemberName} from "./MemberName";

export class Member extends ValueContainer implements iMember {
	n: iMemberName;
	constructor(h: iNodeHash, name: string, input: HTMLElement|ValueType, f: iNodeFactory) {
		super();
		this.f = f;
		let e: HTMLElement = this._init(h,input);
		if (input instanceof HTMLElement) {
			this.n = new MemberName(h,<HTMLElement>e.firstChild);
		} else {
			this.n = new MemberName(h,name);
			this._append(this.n,this.v);
		}
	}
	getName(): string {
		return this.n.name;
	}
	setName(name: string) {
		this.n.setName(name);
	}
	toString() {
		return '"'+ElementParser.str2json(this.n+'')+'":'+this.v;
	}
	protected _init(h: iNodeHash, input: HTMLElement|ValueType): HTMLElement {
		let e: HTMLElement;
		if (input instanceof HTMLElement) {
			e = super._init(h,input);
			this.v = this.f.create(this._h,<HTMLElement>e.lastChild);
		} else {
			e = super._init(h,'member');
			this.v = this.f.create(this._h,input);
			this._append(this.v);
		}
		return e;
	}
}
