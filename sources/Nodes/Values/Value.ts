/// <reference path="../../typings/index.d.ts" />

import {ProtoBase} from "../ProtoBase";

export abstract class Value extends ProtoBase implements iValue {
	type: ValueType;
	value: ValueContent;
	isNotRoot(): boolean {
		let tag = this.e.parentElement ? this.e.parentElement.tagName : null;
		return tag === 'ITEM' || tag === 'MEMBER';
	}
	getParentContainer(): iValueContainer {
		return this.isNotRoot() ? <iValueContainer>super.parent() : null;
	}
	parent(): iValueContainer {
		return this.isNotRoot() ? <iValueContainer>super.parent() : null;
	}
	prev(): iValue {
		return this._getSibling(false);
	}
	next(): iValue {
		return this._getSibling(true);
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
	protected _getSibling(next: boolean) {
		// get container element
		let container = <HTMLElement>this.e.parentElement || null;
		if (!this.isNotRoot()) {return null;}
		// get sibling element
		let sibling = <HTMLElement>container[next?'nextSibling':'previousSibling'] || null;
		if (!sibling) {return null;}
		// get sibling value
		let value = <HTMLElement>sibling.lastChild || null;
		return value ? <iValue>this._h.get(value) : null;
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
