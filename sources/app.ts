///<reference path="../typings/index.d.ts" />
///<reference path="./typings/index.d.ts" />

import * as $ from "jquery";

import {clearTextNodes} from "./NodeEngineUtils";
import {NodeHash} from "./NodeHash";
import {NodeEngine} from "./NodeEngine";
import {TreeState} from "./TreeState";
import {KeyboardShortcutRegistry} from "./Forms/KeyboardShortcutRegistry";
import {GenericTreeForm} from "./Forms/GenericTreeForm";
import {GenericTreeFormFactory} from "./Forms/GenericTreeFormFactory";
import {StartTreeForm} from "./Forms/Actions/StartTreeForm";
import {AddItemForm} from "./Forms/Actions/AddItemForm";
import {AddMemberForm} from "./Forms/Actions/AddMemberForm";
import {EditItemForm} from "./Forms/Actions/EditItemForm";
import {EditMemberForm} from "./Forms/Actions/EditMemberForm";
import {EditValueForm} from "./Forms/Actions/EditValueForm";
import {SwitchTypeForm} from "./Forms/Actions/SwitchTypeForm";
import {NavigationForm} from "./Forms/Actions/NavigationForm";

import "helpers";

var state = new TreeState();

$(function(){
	try {
		state.navigating = false;
		state.hash = new NodeHash();
		state.engine = NodeEngine;
		state.treeBase = document.getElementById('treeBase');
		state.formBase = document.getElementById('formBase');
		state.formFactory = new GenericTreeFormFactory(state.formBase);
		state.kbsRegister = new KeyboardShortcutRegistry(document);
		let rootElement = clearTextNodes(state.treeBase).childNodes.item(0);
		if (rootElement) {
			let v = state.factory(<HTMLElement>rootElement);
			state.setRoot(v);
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
				if (event.data.rootValue) {$('#jsonOutput').html(event.data.rootValue+'');}
			});
		(<any>window).t = state.rootValue;
	} catch (e) {
		console.log(e);
	}
});

function clickItem(event: JQueryEventObject) {
	event.stopPropagation();
	let itemElement: HTMLElement = this;
	let state = <iTreeState>event.data;
	let item = <iItem>state.hash.getNode(itemElement);
	state.manipulate();
	state.select(item);
	state.form = state.formFactory.create('editItemForm');
	state.formControl = new EditItemForm(state);
}
function clickMember(event: JQueryEventObject) {
	event.stopPropagation();
	let memberElement: HTMLElement = this;
	let state = <iTreeState>event.data;
	let member = <iMember>state.hash.getNode(memberElement);
	state.manipulate();
	state.select(member);
	state.form = state.formFactory.create('editMemberForm');
	state.formControl = new EditMemberForm(state);
}
function clickName(event: JQueryEventObject) {
	event.stopPropagation();
	let nameElement: HTMLElement = this;
	let memberElement: HTMLElement = nameElement.parentElement;
	let state = <iTreeState>event.data;
	let member = <iMember>state.hash.getNode(memberElement);
	state.manipulate();
	state.select(member);
	state.form = state.formFactory.create('editMemberForm');
	state.formControl = new EditMemberForm(state);
}
function clickValue(event: JQueryEventObject) {
	event.stopPropagation();
	let valueElement: HTMLElement = this;
	let state = <iTreeState>event.data;
	let value = <iValue>state.hash.getNode(valueElement);
	let type: ValueType = value.type;
	state.manipulate();
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
			state.form = state.formFactory.create('editValueForm');
			state.formControl = new EditValueForm(state);
			break;
		case 'n':
			state.form = state.formFactory.create('editValueForm');
			state.formControl = new EditValueForm(state);
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
