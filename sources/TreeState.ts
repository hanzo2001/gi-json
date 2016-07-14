///<reference path="./typings/index.d.ts" />
///<reference path="../typings/index.d.ts" />

import {NavigationForm} from "./Forms/Actions/NavigationForm";

export class TreeState implements iTreeState {
	hash: iNodeHash;
	engine: (h: iNodeHash, input: HTMLElement|ValueType) => iValue;
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
	factory(input: HTMLElement|ValueType): iValue {
		return this.engine(this.hash,input);
	}
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
	setRoot(v: iValue) {
		this.rootValue = v;
		this.treeRoot = v.e;
		this.treeBase.appendChild(v.e);
		this.select(v);
		this.navigating = true;
	}
} 
