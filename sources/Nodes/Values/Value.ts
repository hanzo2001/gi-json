/// <reference path="../../typings/index.d.ts" />

import {ProtoBase} from "../ProtoBase";

export class Value extends ProtoBase implements iValue {
	e: HTMLElement;
	type: ValueType;
	value: ValueContent;
	getParentContainer(): iValueContainer {
		let parentTag = this.e.parentElement.tagName;
		return parentTag === 'ITEM' || parentTag === 'MEMBER' ? <iValueContainer>this.getParent() : null;
	}
	isEmpty(): boolean {
		return this.e.innerHTML === '&nbsp;';
	}
	isEditable(): boolean {
		return false;
	}
	isComplex(): boolean {
		return false;
	}
	getValue(): ValueContent {
		return this.value;
	}
	getDisplayValue(): string {
		return '';
	}
	setValue(value: ValueContent) {}
	resetValue() {
		this._defaultValue(this.e);
		return this.e;
	}
	protected _init(h: iNodeHash, input: HTMLElement|string): HTMLElement {
		let e: HTMLElement;
		let type: ValueType;
		if (input instanceof HTMLElement) {
			e = super._init(h,input);
			this.type = <ValueType>e.dataset['t'];
			this.value = this._extractValue(e);
		} else {
			e = super._init(h,'value');
			e.dataset['t'] = input;
			this.type = <ValueType>input;
			this.value = this._defaultValue(e);
		}
		return e;
	}
	protected _defaultValue(e: HTMLElement): ValueContent {
		e.innerHTML = '&nbsp;';
		return null;
	}
	protected _extractValue(e: HTMLElement): ValueContent {
		return null;
	}
}
