///<reference path="../../typings/iKeyboardShortcutRegistry.d.ts" />
///<reference path="../../typings/iNodeEngine.d.ts" />
///<reference path="../../typings/iGenericTreeForm.d.ts" />

import * as $ from "jquery";
import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class EditMemberContainerForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		this.tid = 'editMemberContainerForm';
		let member = <iMember>state.selectedNode;
		let objectValue = <iObjectValue>member.getParent();
		state.select(objectValue);
		this.contextData = {
			members: objectValue.getMemberNames()
		};
		this._build(state);
	}
	protected removeMember(event: JQueryEventObject) {
		let button = <HTMLElement>event.currentTarget;
		let li = button.parentElement;
		let name = button.dataset['memberName'];
		let objectValue = <iObjectValue>this.target;
		objectValue.removeMember(name);
		$(button).remove();
		$(li).remove();
		if (!objectValue.s) {this._close();}
	}
}
