///<reference path="../typings/index.d.ts" />
///<reference path="./typings/index.d.ts" />

import * as $ from "jquery";

import {clearTextNodes} from "./NodeEngineUtils";
import {NodeHash} from "./NodeHash";
import {NodeEngine} from "./NodeEngine";
import {TreeState} from "./TreeState";
import {KeyboardShortcutRegistry} from "./Forms/KeyboardShortcutRegistry";
import {StartTreeForm} from "./Forms/Actions/StartTreeForm";
import {AddItemForm} from "./Forms/Actions/AddItemForm";
import {AddMemberForm} from "./Forms/Actions/AddMemberForm";
import {EditItemContainerForm} from "./Forms/Actions/EditItemContainerForm";
import {EditMemberContainerForm} from "./Forms/Actions/EditMemberContainerForm";
import {EditMemberForm} from "./Forms/Actions/EditMemberForm";
import {EditableValueForm} from "./Forms/Actions/EditableValueForm";
import {SwitchTypeForm} from "./Forms/Actions/SwitchTypeForm";
import {NavigationForm} from "./Forms/Actions/NavigationForm";
import {GenericTreeForm} from "./Forms/GenericTreeForm";
import {GenericTreeFormFactory} from "./Forms/GenericTreeFormFactory";

import "helpers";

var state = new TreeState();

$(function(){
	try {
		state.hash = new NodeHash();
		state.engine = NodeEngine;
		state.treeBase = document.getElementById('treeBase');
		state.formBase = document.getElementById('formBase');
		state.formFactory = new GenericTreeFormFactory(state.formBase);
		state.kbsRegister = new KeyboardShortcutRegistry(document);
		let rootElement = clearTextNodes(state.treeBase).childNodes.item(0);
		if (rootElement) {
			state.factory(<HTMLElement>rootElement);
			state.navigate();
		} else {
			state.form = state.formFactory.create('startTreeForm');
			state.formControl = new StartTreeForm(state);
		}
		$(state.treeBase)
			.on('click','member',state,clickMember)
			.on('click','item',  state,clickItem)
			.on('click','name',  state,clickName)
			.on('click','value', state,clickValue);
		$('#outputJSON')
			.click(state,function(event: JQueryEventObject){
				if (event.data.rootValue) {$('#jsonOutput').text(event.data.rootValue+'');}
			});
		(<any>window).t = state.rootValue;
	} catch (e) {
		console.log(e);
	}
});

function clickMember(event: JQueryEventObject) {
	console.log('app.clickMember');
	event.stopPropagation();
	let memberElement: HTMLElement = this;
	let state = <iTreeState>event.data;
	try{
	state.manipulate();
	state.form = state.formFactory.create('editMemberContainerForm');
	let member = <iMember>state.hash.getNode(memberElement);
	state.select(member);
	state.formControl = new EditMemberContainerForm(state);
	}catch(e){console.log(e);}
}
function clickItem(event: JQueryEventObject) {
	console.log('app.clickItem');
	event.stopPropagation();
	let itemElement: HTMLElement = this;
	let state = <iTreeState>event.data;
	state.manipulate();
	state.form = state.formFactory.create('editItemContainerForm');
	let item = <iItem>state.hash.getNode(itemElement);
	state.select(item);
	state.formControl = new EditItemContainerForm(state);
}
function clickName(event: JQueryEventObject) {
	console.log('app.clickName');
	event.stopPropagation();
	let nameElement: HTMLElement = this;
	let memberElement: HTMLElement = nameElement.parentElement;
	let state = <iTreeState>event.data;
	state.manipulate();
	state.form = state.formFactory.create('editMemberForm');
	let member = <iMember>state.hash.getNode(memberElement);
	state.select(member);
	state.formControl = new EditMemberForm(state);
}
function clickValue(event: JQueryEventObject) {
	console.log('app.clickValue');
	event.stopPropagation();
	let valueElement: HTMLElement = this;
	let state = <iTreeState>event.data;
	state.manipulate();
	let value = <iValue>state.hash.getNode(valueElement);
	let type: ValueType = value.type;
	state.select(value);
	switch (type) {
		case 'u':
			state.form = state.formFactory.create('switchTypeForm');
			state.formControl = new SwitchTypeForm(state);
			break;
		case 'b':
			value.setValue(!value.getValue());
			state.navigate();
			break;
		case 's':
			state.form = state.formFactory.create('editableValueForm');
			state.formControl = new EditableValueForm(state);
			break;
		case 'n':
			state.form = state.formFactory.create('editableValueForm');
			state.formControl = new EditableValueForm(state);
			break;
		case 'o':
			state.form = state.formFactory.create('addMemberForm');
			state.formControl = new AddMemberForm(state);
			break;
		case 'a':
			state.form = state.formFactory.create('addItemForm');
			state.formControl = new AddItemForm(state);
			break;
	}
}
