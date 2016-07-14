///<reference path="../../typings/iKeyboardShortcutRegistry.d.ts" />
///<reference path="../../typings/iNodeEngine.d.ts" />
///<reference path="../../typings/iGenericTreeForm.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class EditMemberForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		let member = <iMember>state.selectedNode;
		this.tid = 'editMemberForm';
		this.contextData = {
			name: member.getName(),
			types: valueTypes,
			selectedType: member.getType(),
			dflt: null
		};
		this._build(state);
		this.formRoot.find('select[name=memberType]').focus();
	}
	protected updateMember(event: JQueryEventObject) {
		let member = <iMember>this.target;
		let objectValue = <iObjectValue>member.getParentValue();
		let oldName = member.getName();
		let oldType = member.getType();
		let newNameInput = this.formRoot.find('input[name=memberName]');
		let newName = newNameInput.val();
		if (newName && !/[^\w-]/.test(newName)) {
			let newType = this.formRoot.find('select[name=memberType]').val();
			if (oldName !== newName) {objectValue.renameMember(oldName,newName);}
			if (oldType !== newType) {member.setType(newType);}
			this._close();
		} else {
			newNameInput.focus();
		}
	}
	protected deleteMember(event: JQueryEventObject) {
		let member = <iMember>this.target;
		let name = member.getName();
		let objectValue = <iObjectValue>member.getParent();
		let next = member.next() || member.prev() || objectValue;
		objectValue.removeMember(name);
		this.state.select(next);
		this._close();
	}
}
