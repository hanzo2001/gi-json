/// <reference path="../../typings/index.d.ts" />

import {Value} from "./Value";
import {ElementParser} from "../Utils";

export class NumberValue extends Value implements iValue {
	e: HTMLElement;
	type: ValueType;
	value: number;
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this._init(h,e||'n');
	}
	getDisplayValue(): string {
		return this.e.innerHTML;
	}
	setValue(input: string) {
		this.value = ElementParser.parseNumber(input);
		if (isNaN(this.value)) {
			this.value = this._defaultValue(this.e);
		} else {
			this.e.innerHTML = input;
		}
	}
	isEditable(): boolean {
		return true;
	}
	toString() {
		return this.e.innerHTML;
	}
	protected _defaultValue(e: HTMLElement): number {
		e.innerHTML = '0';
		return 0;
	}
	protected _extractValue(e: HTMLElement): number {
		let value: number = ElementParser.parseNumber(e.innerHTML)
		if (isNaN(value)) {
			return this._defaultValue(e);
		}
		return value;
	}
}
