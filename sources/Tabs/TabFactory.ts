/// <reference path="../../typings/index.d.ts" />
/// <reference path="../typings/iTab.d.ts" />

import * as $ from "jquery";
import {Tab} from "./Tab";

export class TabFactory implements iTabFactory {
	headScript: HandlebarsTemplateDelegate;
	bodyScript: HandlebarsTemplateDelegate;
	constructor(headScript: HandlebarsTemplateDelegate, bodyScript: HandlebarsTemplateDelegate) {
		this.headScript = headScript;
		this.bodyScript = bodyScript;
	}
	createTab(id: string): iTab {
		return new Tab(
			$(this.headScript({tabName:id})),
			$(this.bodyScript({tabName:id}))
		);
	}
}
