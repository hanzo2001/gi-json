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
		let v = this.engine(this.hash,input);
		if (!this.rootValue) {
			this.rootValue = v;
			this.treeRoot = v.e;
			this.treeBase.appendChild(v.e);
			this.select(v);
		}
		return v;
	}
	select(node: iProtoBase) {
		if (node === this.selectedNode) {return;}
		if (this.selectedNode) {
			this.selectedNode.e.removeAttribute('class');
		}
		this.selectedNode = node;
		this.selectedNode.e.setAttribute('class','selectedNode');
	}
	deselect() {
		if (this.selectedNode) {
			this.selectedNode.e.removeAttribute('class');
			this.selectedNode = null;
		}
	}
	navigate() {
		console.log('state.navigate');
		this.form = this.formFactory.create('navigationForm');
		this.formControl = new NavigationForm(this);
		this.navigating = true;
	}
	manipulate() {
		console.log('state.manipulate');
		this.formControl && this.formControl.closeForm();
		this.formControl = null;
		this.form = null;
		this.navigating = false;
	}
} 
