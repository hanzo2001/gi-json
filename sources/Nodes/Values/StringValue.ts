/// <reference path="../../typings/index.d.ts" />

import {Value} from "./Value";
import {ElementParser} from "../Utils";

export class StringValue extends Value implements iValue {
	e: HTMLElement;
	type: ValueType;
	value: string;
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this._init(h,e||'s');
	}
	isEditable(): boolean {
		return true;
	}
	getDisplayValue(): string {
		return this.e.innerHTML === '&nbsp;' ? '' : this.e.innerHTML;
	}
	setValue(value: string) {
		if (value === '') {
			this.value = this._defaultValue(this.e);
		} else {
			this.e.innerHTML = ElementParser.str2html(value);
			this.value = value;
		}
	}
	toString() {
		let value = ElementParser.str2json(this.value);
		return '"'+value+'"';
	}
	protected _defaultValue(e: HTMLElement): string {
		e.innerHTML = '&nbsp;';
		return '';
	}
	protected _extractValue(e: HTMLElement): string {
		let value: string = e.innerHTML;
		if (value === '') {this.e.innerHTML = '&nbsp;';}
		return value === '&nbsp;' ? '' : ElementParser.html2str(value);
	}
}
