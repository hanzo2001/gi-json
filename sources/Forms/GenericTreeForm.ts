///<reference path="../typings/iGenericTreeForm.d.ts" />

import * as $ from "jquery";
import * as Handlebars from "handlebars";

export class GenericTreeForm implements iGenericTreeForm {
	protected _tid: string;
	protected _form: JQuery;
	protected _formBase: HTMLElement;
	protected _script: HandlebarsTemplateDelegate;
	protected _loaded: boolean;
	constructor(id: string, formBase: HTMLElement) {
		this._tid = id;
		this._formBase = formBase;
		this._script = Handlebars.compile($('#'+id).html());
		this._loaded = false;
	}
	id(): string {
		return this._tid;
	}
	get(): JQuery {
		return this._form;
	}
	show(data: Object): void {
		if (!this._loaded) {
			this._form = $(this._script(data));
			$(this._formBase).append(this._form);
			this._loaded = true;
		}
	}
	remove(): void {
		if (this._loaded) {
			this._form.remove();
			this._loaded = false;
		}
	}
}
