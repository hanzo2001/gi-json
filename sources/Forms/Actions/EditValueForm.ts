///<reference path="../../typings/index.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class EditValueForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		let value = <iValue>state.selectedNode;
		this.tid = 'editValueForm';
		this.contextData = {
			value : value.getValue()
		};
		this._build(state);
		this.formRoot.find('input[name=value]').focus();
	}
	protected updateValue(event: JQueryEventObject) {
		let value = <iValue>this.target;
		let oldValue = value.getValue();
		let newValue = this.formRoot.find('input[name=value]').val();
		if (oldValue !== newValue) {value.setValue(newValue);}
		this._close();
	}
}
