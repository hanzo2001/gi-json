/// <reference path="../typings/index.d.ts" />

import {clickMember,clickItem,clickValue,clickName} from "./ElementClickEvents";
import {GenericTreeForm} from "../Forms/GenericTreeForm";
import {StartTreeForm} from "../Forms/Actions/StartTreeForm";

export class TreeState implements iTreeState {
	tab: iTab;
	history: iHistoryList<iTab>;
	kbsRegister: iKbsRegistry;
	navigator: iTreeNavigator;
	hash: iNodeHash;
	engine: iNodeEngine;
	active: boolean;
	navigating: boolean;
	navigationEvents: ShortcutEventCallbackHash;
	root: HTMLElement;
	form: iGenericTreeForm;
	formBase: HTMLElement;
	treeBase: HTMLElement;
	outputElement: HTMLElement;
	formControl: iGenericFormAction;
	formFactory: (id:string) => iGenericTreeForm;
	rootValue: iValue;
	serialize: (json:string, title:string)=>void;
	constructor(o: iTreeStateConfig) {
		this.tab = o.tab;
		o.tab.state = this;
		this.engine = o.engine;
		this.history = o.history;
		this.navigator = o.navigator;
		this.kbsRegister = o.kbsRegister;
		this.serialize = o.serialize || function () {};
		this.active = false;
		this.navigating = false;
		// hide current tab
		let nextTab = this.history.current();
		if (nextTab) {nextTab.state.unfocus();}
		//initialize() {
		this.history.add(this.tab);
		// setup tab events
		/* <select> */ $(this.tab.title ).click(e=>this.focus());
		/* <remove> */ $(this.tab.button).click(e=>this.teardown());
		// setup navigational shortcuts
		let kc = {
			w : 87,
			a : 65,
			s : 83,
			d : 68,
			_ : 32,
		};
		/* <w> */ this.kbsRegister.register(kc.w,e=>this.navigator.prev());
		/* <a> */ this.kbsRegister.register(kc.a,e=>this.navigator.parent());
		/* <s> */ this.kbsRegister.register(kc.s,e=>this.navigator.next());
		/* <d> */ this.kbsRegister.register(kc.d,e=>this.navigator.first());
		/* <space> */ this.kbsRegister.register(kc._,e=>$((<NodeEngineTarget>this.navigator.node).e).click());
		this.navigationEvents = this.kbsRegister.clear();
		// setup DOM Element nodes
		this.root = this.tab.body;
		this.treeBase = <HTMLElement>this.root.appendChild(document.createElement('div'));
		this.formBase = <HTMLElement>this.root.appendChild(document.createElement('div'));
		this.treeBase.setAttribute('class','treeBase');
		this.formBase.setAttribute('class','formBase');
		// setup Node <click> events
		$(this.treeBase)
			.on('click','member',this,clickMember)
			.on('click','item',  this,clickItem)
			.on('click','name',  this,clickName)
			.on('click','value', this,clickValue);
		// setup startTreeForm
		this.formFactory = (id) => new GenericTreeForm(id,this.formBase);
		this.manipulate();
		this.form = this.formFactory('startTreeForm');
		this.formControl = new StartTreeForm(this);
		// all done...
		this.focus();
		// setup output
		this.outputElement = <HTMLElement>this.root.appendChild(document.createElement('button'));
		this.outputElement.innerHTML = 'Output JSON';
		$(this.tab.head).dblclick((e)=>(
			this.renameTab()
		));
		$(this.outputElement).click((e)=>(
			this.rootValue && this.serialize(this.rootValue.toString(),this.tab.getTitle())
		));
	}
	teardown() {
		let nextTab : iTab;
		$(this.tab.title).off('click');
		$(this.tab.button).off('click');
		$(this.treeBase)
			.off('click','member')
			.off('click','item')
			.off('click','name')
			.off('click','value');
		this.kbsRegister.clear();
		this.kbsRegister.ignore();
		this.history.remove(this.tab);
		this.engine.empty();
		this.tab.blurTab();
		this.tab.closeTab();
		if (this.active) {
			nextTab = this.history.current();
			if (nextTab) {
				nextTab.state.focus();
			}
		}
		this.tab = null;
		this.history = null;
		this.kbsRegister = null;
		this.navigator = null;
		this.engine = null;
		this.navigationEvents = null;
		this.root = null;
		this.form = null;
		this.formBase = null;
		this.treeBase = null;
		this.formControl = null;
		this.formFactory = null;
		this.rootValue = null;
		return null;
	}
	currentState(): iTreeState {
		let tab = this.history.current();
		return tab ? tab.state : null;
	}
	focus() {
		if (!this.active) {
			let lastState = this.currentState();
			lastState && lastState.unfocus();
			this.history.push(this.tab);
			this.tab.focusTab();
			this.kbsRegister.listen();
			this.active = true;
		}
	}
	unfocus() {
		if (this.active) {
			this.tab.blurTab();
			this.kbsRegister.ignore();
			this.active = false;
		}
	}
	selectedNode(): iNavigatable {
		return this.navigator.node;
	}
	navigate() {
		if (!this.navigating) {
			this.navigating = true;
			this.kbsRegister.unclear(this.navigationEvents);//optimization
			this.form = null;
			this.formControl = null;
		}
	}
	manipulate() {
		this.navigating = false;
		this.kbsRegister.clear();
		this.formControl && this.formControl.closeForm();
		this.form = null;
		this.formControl = null;
	}
	setRoot(type: ValueType) {
		if (!this.rootValue) {
			this.rootValue = this.engine.createValue(type);
			this.treeBase.appendChild(this.rootValue.e);
			this.navigator.select(this.rootValue);
		}
	}
	getNode(e: HTMLElement): iProtoBase {
		return this.engine.getNode(e);
	}
	renameTab() {
		let title = this.tab.getTitle();
		let events = this.kbsRegister.clear();
		title = window.prompt('Rename tab',title);
		this.tab.renameTab(title);
		setTimeout(()=>this.kbsRegister.unclear(events),300);
	}
}