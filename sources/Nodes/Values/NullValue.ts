/// <reference path="../../typings/index.d.ts" />

import {Value} from "./Value";

export class NullValue extends Value implements iValue {
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this._init(h,e||'u');
	}
	toString() {
		return 'null';
	}
}
