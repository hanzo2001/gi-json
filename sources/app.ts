///<reference path="../typings/index.d.ts" />

import * as $ from "jquery";
import {NodeHash} from "./NodeHash";
import {NodeEngine} from "./NodeEngine";
import {TreeState} from "./TreeState";
import {StartTreeForm,AddItemForm,AddMemberForm,EditItemContainerForm,EditMemberContainerForm,EditMemberForm,EditableValueForm,SwitchTypeForm} from "./TreeForms";
import "helpers";

$(function(){
	try {
		let engine = NodeEngine;
		let hash = new NodeHash();
		let state = new TreeState(hash,engine);
		state.treeBase = document.getElementById('treeBase');
		state.formBase = document.getElementById('formBase');
		state.rootElement = <HTMLElement>state.treeBase.childNodes.item(1);
		if (state.rootElement) {
			state.rootValue = state.factory(state.rootElement);
		} else {
			(new StartTreeForm(state)).build();
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
	event.stopPropagation();
	let memberElement: HTMLElement = this;
	let state = <TreeState>event.data;
	let controlForm = state.controlForm;
	if (controlForm) {controlForm.closeForm();}
	controlForm = new EditMemberContainerForm(state);
	controlForm.build(<Member>state.hash.getNode(memberElement));
	state.controlForm = controlForm;
}
function clickItem(event: JQueryEventObject) {
	event.stopPropagation();
	let itemElement: HTMLElement = this;
	let state = <TreeState>event.data;
	let controlForm = state.controlForm;
	if (controlForm) {controlForm.closeForm();}
	controlForm = new EditItemContainerForm(state);
	controlForm.build(<Item>state.hash.getNode(itemElement));
	state.controlForm = controlForm;
}
function clickName(event: JQueryEventObject) {
	event.stopPropagation();
	let name: HTMLElement = this;
	let member: HTMLElement = name.parentElement;
	let state = <TreeState>event.data;
	let controlForm = state.controlForm;
	if (controlForm) {controlForm.closeForm();}
	controlForm = new EditMemberForm(state);
	controlForm.build(<Member>state.hash.getNode(member));
	state.controlForm = controlForm;
}
function clickValue(event: JQueryEventObject) {
	event.stopPropagation();
	let valueElement: HTMLElement = this;
	let state = <TreeState>event.data;
	let controlForm = state.controlForm;
	if (controlForm) {controlForm.closeForm();}
	state.controlForm = controlForm = null;
	let value = <Value>state.hash.getNode(valueElement);
	let type: ValueType = value.type;
	switch (type) {
		case 'u': controlForm = new SwitchTypeForm(state); break;
		case 'b': value.setValue(!value.getValue()); break;
		case 's': controlForm = new EditableValueForm(state); break;
		case 'n': controlForm = new EditableValueForm(state); break;
		case 'o': controlForm = new AddMemberForm(state); break;
		case 'a': controlForm = new AddItemForm(state); break;
	}
	state.controlForm = controlForm;
	controlForm && controlForm.build(value);
}
