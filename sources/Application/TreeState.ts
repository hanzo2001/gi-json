///<reference path="../typings/index.d.ts" />

import {NavigationForm} from "../Forms/Actions/NavigationForm";
import {clearTextNodes} from "../Nodes/Utils";
import {NodeHash} from "../Nodes/NodeHash";
import {NodeEngine} from "../Nodes/NodeEngine";
import {GenericTreeFormFactory} from "../Forms/GenericTreeFormFactory";
import {KeyboardShortcutRegistry} from "./KeyboardShortcutRegistry";
import {StartTreeForm} from "../Forms/Actions/StartTreeForm";

export class TreeState implements iTreeState {
	hash: iNodeHash;
	engine: iNodeEngine;
	rootValue: iValue;
	treeBase: HTMLElement;
	treeRoot: HTMLElement;
	formBase: HTMLElement;
	formControl: iGenericFormAction;
	formFactory: iGenericTreeFormFactory;
	form: iGenericTreeForm;
	selectedNode: iProtoBase;
	kbsRegister: iKeyboardShortcutRegistry;
	navigating: boolean;
	select(node: iProtoBase) {
		if (node === this.selectedNode) {return;}
		let s = this.selectedNode;
		s && s.e && s.e.removeAttribute('class');
		node.e.setAttribute('class','selectedNode');
		this.selectedNode = node;
	}
	deselect() {
		if (this.selectedNode) {
			this.selectedNode.e.removeAttribute('class');
			this.selectedNode = null;
		}
	}
	navigate() {
		this.form = this.formFactory.create('navigationForm');
		this.formControl = new NavigationForm(this);
		this.navigating = true;
	}
	manipulate() {
		this.formControl && this.formControl.closeForm();
		this.formControl = null;
		this.form = null;
		this.navigating = false;
	}
	setRoot(input: HTMLElement|ValueType) {
		let v = this.engine.createValue(input);
		this.rootValue = v;
		this.treeRoot = v.e;
		this.treeBase.appendChild(v.e);
		this.select(v);
		this.navigating = true;
	}
	static init(config: iTreeStateConfig) {
		let root = config.root;
		let events = config.events;
		let state = new TreeState();
		state.navigating = false;
		state.hash = new NodeHash();
		state.engine = new NodeEngine(state.hash);
		state.treeBase = <HTMLElement>root.appendChild(document.createElement('div'));
		state.formBase = <HTMLElement>root.appendChild(document.createElement('div'));
		state.treeBase.setAttribute('class','treeBase');
		state.formBase.setAttribute('class','formBase');
		state.formFactory = new GenericTreeFormFactory(state.formBase);
		state.kbsRegister = new KeyboardShortcutRegistry(root);
		let rootElement = <HTMLElement>clearTextNodes(state.treeBase).childNodes.item(0);
		if (rootElement) {
			state.setRoot(rootElement);
			state.navigate();
		} else {
			state.form = state.formFactory.create('startTreeForm');
			state.formControl = new StartTreeForm(state);
		}
		$(state.treeBase)
			.on('click','member',state,events.clickMember)
			.on('click','item',  state,events.clickItem)
			.on('click','name',  state,events.clickName)
			.on('click','value', state,events.clickValue);
		/*
		$('#outputJSON')
			.click(state,function(event: JQueryEventObject){
				if (event.data.rootValue) {$('#jsonOutput').html(event.data.rootValue+'');}
			});
		//*/
		return state;
	}
} 
