/// <reference path="../typings/index.d.ts" />

import * as $ from "jquery";
import {Tab} from "./Tab";

export class TabFactory implements iTabFactory {
	protected ids: number;
	protected headScript: HandlebarsTemplateDelegate;
	protected bodyScript: HandlebarsTemplateDelegate;
	constructor(headScript: HandlebarsTemplateDelegate, bodyScript: HandlebarsTemplateDelegate) {
		this.ids = 0;
		this.headScript = headScript;
		this.bodyScript = bodyScript;
	}
	create(title: string): iTab {
		let id = ++this.ids;
		let head = $(this.headScript({tabId:id,tabTitle:title}));
		let body = $(this.bodyScript({tabId:id}));
		let headElement = head[0];
		let titleElement = head.find('span')[0];
		let buttonElement = head.find('button')[0];
		let containerElement = body[0];
		let tab = new Tab(id,headElement,titleElement,buttonElement,containerElement);
		return tab;
	}
}
