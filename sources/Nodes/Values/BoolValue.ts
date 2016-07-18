/// <reference path="../../typings/index.d.ts" />

import {Value} from "./Value";
import {ElementParser} from "../Utils";

export class BoolValue extends Value implements iValue {
	e: HTMLElement;
	type: ValueType;
	value: boolean;
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this._init(h,e||'b');
	}
	getDisplayValue(): string {
		return this.e.innerHTML;
	}
	setValue(input: ValueContent) {
		if (typeof(input) === 'string') {
			this.value = ElementParser.parseBool(<string>input);
		} else {
			this.value = !!input;
		}
		this.e.innerHTML = this.value ? 'true' : 'false';
	}
	toString() {
		return this.e.innerHTML;
	}
	protected _defaultValue(e: HTMLElement): boolean {
		e.innerHTML = 'false';
		return false;
	}
	protected _extractValue(e: HTMLElement): boolean {
		let value: boolean = ElementParser.parseBool(e.innerHTML);
		e.innerHTML = value ? 'true' : 'false';
		return value;
	}
}
