///<reference path="../typings/index.d.ts" />

import {GenericTreeForm} from './GenericTreeForm';

export class GenericTreeFormFactory implements iGenericTreeFormFactory {
	protected base: HTMLElement;
	protected cache: GenericTreeFormHash;
	constructor(base: HTMLElement) {
		this.cache = {};
		this.base = base;
	}
	create(id: string): iGenericTreeForm {
		let form: iGenericTreeForm = this.cache[id];
		if (!form) {
			form = this.cache[id] = new GenericTreeForm(id,this.base);
		}
		return form;
	}
	load(id: string): iGenericTreeForm {
		return this.cache[id] || null;
	}
}
