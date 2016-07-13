///<reference path="../../typings/iKeyboardShortcutRegistry.d.ts" />
///<reference path="../../typings/iNodeEngine.d.ts" />
///<reference path="../../typings/iGenericTreeForm.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class AddMemberForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		let objectValue = <iObjectValue>state.selectedNode;
		this.tid = 'addMemberForm';
		this.contextData = {
			types: valueTypes,
			selectedType: 'u',
			dflt: null
		};
		this._build(state);
		this.formRoot.find('input[name=memberName]').focus();
	}
	protected createMember(event: JQueryEventObject) {
		let memberNameElement = this.formRoot.find('input[name=memberName]');
		let name = memberNameElement.val();
		if (name && !/[^\w-]/.test(name)) {
			let objectValue = <iObjectValue>this.target;
			let type = this.formRoot.find('select[name=memberType]').val();
			objectValue.addMember(name,type);
		}
		memberNameElement.val('');
		memberNameElement.focus();
	}
}
