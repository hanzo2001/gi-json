/// <reference path="../typings/index.d.ts" />

import {ProtoBase} from "./ProtoBase";

export abstract class ValueContainer extends ProtoBase implements iValueContainer {
	v: iValue;
	f: iNodeFactory;
	getParentValue(): iComplexValue {
		return <iComplexValue>this.parent();
	}
	getType(): ValueType {
		return this.v.type;
	}
	setType(type: ValueType): iValue {
		this.v.remove(true);
		this.v = this.f.create(this._h,type);
		this._append(this.v);
		return this.v;
	}
	prev(): iValueContainer {
		let e = <HTMLElement>this.e.previousElementSibling;
		let c = e ? this._h.get(e) : null;
		return <iValueContainer>c;
	}
	next(): iValueContainer {
		let e = <HTMLElement>this.e.nextElementSibling;
		let c = e ? this._h.get(e) : null;
		return <iValueContainer>c;
	}
	first(): iValue {
		return this.v;
	}
	last(): iValue {
		return this.v;
	}
	_remove(unlink: boolean): HTMLElement {
		let e: HTMLElement = this.v.remove(unlink);
		this.v = null;
		return super.remove(unlink);
	}
}
