///<reference path="../../typings/index.d.ts" />

import * as $ from "jquery";
import * as Handlebars from "handlebars";
import {TabHistory} from "./TabHistory";
import {TabFactory} from "./TabFactory";
import {TabManager} from "./TabManager";

export class TabEngine implements iTabEngine {
	events: iTabEvents;
	manager: iTabManager;
	history: iTabHistory;
	factory: iTabFactory;
	constructor(manager: iTabManager, history: iTabHistory, factory: iTabFactory) {
		this.history = history;
		this.manager = manager;
		this.factory = factory;
	}
	closeTab(tab: iTab): iTab {
		let nextTab = this.history.removeEntry(tab.hid);
		return nextTab;
	}
	selectTab(tab: iTab): iTab {
		let selected = this.history.getCurrent();
		if (tab.hid) {
			this.history.pushEntry(tab.hid);
		} else {
			tab.hid = this.history.addEntry(tab);
		}
		return selected;
	}
	addTab(id: string): iTab {
		let tab = this.factory.createTab(id);
		let selected = this.history.getCurrent();
		tab.hid = this.history.addEntry(tab);
		if (selected) {selected.deselect();}
		this.manager.appendTab(tab);
		return tab;
	}
	static init(config: iTabConfig): iTabEngine {
		let root = config.rootElement;
		let tH = <HTMLElement>root.appendChild(document.createElement('div'));
		let tC = <HTMLElement>root.appendChild(document.createElement('div'));
		let tB = <HTMLElement>tH.appendChild(document.createElement('button'));
		tB.innerHTML = '+';
		tH.setAttribute('class','tabHeader');
		tC.setAttribute('class','tabContainer');
		let scriptHeadTpl = Handlebars.templates['tabHeadTpl'];
		let scriptBodyTpl = Handlebars.templates['tabContainerTpl'];
		//let scriptHeadTpl = Handlebars.compile($('#tabHeadTpl').html());
		//let scriptBodyTpl = Handlebars.compile($('#tabContainerTpl').html());
		let factory = new TabFactory(scriptHeadTpl,scriptBodyTpl);
		let history = new TabHistory();
		let manager = new TabManager(tH,tC);
		let engine = new TabEngine(manager,history,factory);
		engine.events = config.events;
		var i = 0;
		$(tB).click(engine,function(event){
			let engine = <iTabEngine>event.data;
			let id = 'tab'+i;
			let tab = engine.addTab(id);
			engine.events.oncreate(tab);
			tab.clickClose(function(e){
				engine.events.onremove(tab);
				return engine.closeTab(e.data);
			});
			tab.clickSelect(function(e){
				engine.events.onselect(tab);
				return engine.selectTab(e.data);
			});
			i++;
		});
		return engine;
	}
}
