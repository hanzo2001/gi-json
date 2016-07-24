/// <reference path="../typings/index.d.ts" />

import {ProtoBase} from "./ProtoBase";
import {ElementParser} from "./Utils";

export class MemberName extends ProtoBase implements iMemberName {
	name: string;
	constructor(h: iNodeHash, input: HTMLElement|string) {
		super();
		if (input instanceof HTMLElement) {
			this._init(h,input);
			this.name = ElementParser.html2str(this.e.innerHTML);
		} else {
			this._init(h,'name');
			this.name = input;
			this.e.innerHTML = ElementParser.str2html(input);
		}
	}
	setName(name: string) {
		this.name = this.e.innerHTML = name;
	}
	toString(): string {
		return this.name;
	}
}
