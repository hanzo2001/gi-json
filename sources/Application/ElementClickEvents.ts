/// <reference path="../typings/index.d.ts" />

import {AddItemForm} from "../Forms/Actions/AddItemForm";
import {AddMemberForm} from "../Forms/Actions/AddMemberForm";
import {EditItemForm} from "../Forms/Actions/EditItemForm";
import {EditMemberForm} from "../Forms/Actions/EditMemberForm";
import {EditValueForm} from "../Forms/Actions/EditValueForm";
import {SwitchTypeForm} from "../Forms/Actions/SwitchTypeForm";

export function clickItem(event: JQueryEventObject) {
	event.stopPropagation();
	let itemElement: HTMLElement = this;
	let state = <iTreeState>event.data;
	let item = <iItem>state.hash.getNode(itemElement);
	state.manipulate();
	state.select(item);
	state.form = state.formFactory.create('editItemForm');
	state.formControl = new EditItemForm(state);
}
export function clickMember(event: JQueryEventObject) {
	event.stopPropagation();
	let memberElement: HTMLElement = this;
	let state = <iTreeState>event.data;
	let member = <iMember>state.hash.getNode(memberElement);
	state.manipulate();
	state.select(member);
	state.form = state.formFactory.create('editMemberForm');
	state.formControl = new EditMemberForm(state);
}
export function clickName(event: JQueryEventObject) {
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
export function clickValue(event: JQueryEventObject) {
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
