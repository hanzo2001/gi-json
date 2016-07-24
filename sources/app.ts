/// <reference path="../typings/index.d.ts" />

import * as $ from "jquery";
import * as Handlebars from "handlebars";
import {HistoryList} from "./Utils/HistoryList";
import {ElementRegistry} from "./Utils/ElementRegistry";
import {IdGeneratorFactory} from "./Utils/IdGenerator";
import {TabSpace} from "./Tabs/TabSpace";
import {TabFactory} from "./Tabs/TabFactory";
import {NodeFactory} from "./Nodes/NodeFactory";
import {NodeEngine} from "./Nodes/NodeEngine";
import {KbsRegistry} from "./Application/KbsRegistry";
import {TreeNavigator} from "./Application/TreeNavigator";
import {TreeState} from "./Application/TreeState";

import "helpers";
import "hbtpl";

$(function(){
	let wE = document.getElementById('WorkSpace');
	let hE = <HTMLElement>wE.appendChild(document.createElement('div'));
	let bE = <HTMLElement>hE.appendChild(document.createElement('button'));
	let cE = <HTMLElement>wE.appendChild(document.createElement('div'));
	let oE = <HTMLElement>wE.appendChild(document.createElement('pre'));
	hE.setAttribute('class','tabHeader');
	cE.setAttribute('class','tabContainer');
	bE.innerHTML = '+';
	let headScript = Handlebars.templates['tabHeadTpl'];
	let bodyScript = Handlebars.templates['tabContainerTpl'];
	let space = new TabSpace(hE,bE,cE);
	let tabFactory = new TabFactory(headScript,bodyScript);
	let tabHistory = new HistoryList<iTab>();
	let idGenerator = new IdGeneratorFactory();
	let nodeElementDataName = 'nid';
	let uuid = idGenerator.create();
	let utid = idGenerator.create();
	let nodeHash = new ElementRegistry<iProtoBase>(uuid,nodeElementDataName);
	let nodeFactory = new NodeFactory();
	let serialize = function (json:string, title:string) {
		oE.innerHTML = '//'+title+'\n';
		oE.innerHTML += json;
	}
	let appConfig: iApplicationConfig = {
		tabSpace: space,
		tabHistory: tabHistory,
		tabFactory: tabFactory,
		nodeHash: nodeHash,
		nodeFactory: nodeFactory,
		utid: utid,
		serialize: serialize
	};
	$(space.button).click(appConfig,StartState);
});

interface iApplicationConfig {
	tabSpace: iTabSpace;
	tabFactory: iTabFactory;
	tabHistory: iHistoryList<iTab>;
	nodeHash: iNodeHash;
	nodeFactory: iNodeFactory;
	utid: ()=>number;
	serialize: (json:string, title:string)=>void;
}

function StartState(e: JQueryEventObject) {
	let o = <iApplicationConfig>e.data;
	let title = window.prompt('Tab Title:','tab'+o.utid());
	if (!title) {return;}
	let tab = o.tabFactory.create(title);
	o.tabSpace.addTab(tab);
	let kbsRegister = new KbsRegistry();
	let engine = new NodeEngine(o.nodeHash,o.nodeFactory);
	let switchCB = function(next: iNavigatable, last: iNavigatable, dir: NavigationDirection){
		if (next !== last) {
			(<iProtoBase>next).e.setAttribute('class','selectedNode');
			last && (<iProtoBase>last).e.removeAttribute('class');
			// ... continue implementing class swap
		}
		return next;
	};
	let navigator = new TreeNavigator(switchCB);
	let state = new TreeState({
		history: o.tabHistory,
		serialize: o.serialize,
		tab: tab,
		engine: engine,
		kbsRegister: kbsRegister,
		navigator: navigator,
	});
}
