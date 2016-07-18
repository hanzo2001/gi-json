/// <reference path="../typings/index.d.ts" />

import {ProtoBase} from "./ProtoBase";

export class ValueContainer extends ProtoBase implements iValueContainer {
	v: iValue;
	f: iNodeEngine;
	getParentValue(): iComplexValue {
		return <any>this.getParent();
	}
	getType(): ValueType {
		return this.v.type;
	}
	setType(type: ValueType): iValue {
		this.v._remove(true);
		this.v = this.f.createValue(type);
		this._append(this.v);
		return this.v;
	}
	prev(): iValueContainer {
		let e = <HTMLElement>this.e.previousElementSibling;
		let c = e ? this._h.getNode(e) : null;
		return <iValueContainer>c;
	}
	next(): iValueContainer {
		let e = <HTMLElement>this.e.nextElementSibling;
		let c = e ? this._h.getNode(e) : null;
		return <iValueContainer>c;
	}
	_remove(unlink: boolean): HTMLElement {
		let e: HTMLElement = this.v._remove(unlink);
		this.v = null;
		return super._remove(unlink);
	}
}
