///<reference path="../../typings/iKeyboardShortcutRegistry.d.ts" />
///<reference path="../../typings/iNodeEngine.d.ts" />
///<reference path="../../typings/iGenericTreeForm.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class EditValueForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		let value = <iValue>state.selectedNode;
		this.tid = 'editValueForm';
		this.contextData = {
			value : value.getDisplayValue()
		};
		this._build(state);
		this.formRoot.find('input[name=value]').focus();
	}
	protected updateValue(event: JQueryEventObject) {
		let value = <iValue>this.target;
		let oldValue = value.getDisplayValue();
		let newValue = this.formRoot.find('input[name=value]').val();
		if (oldValue !== newValue) {value.setValue(newValue);}
		this._close();
	}
}
