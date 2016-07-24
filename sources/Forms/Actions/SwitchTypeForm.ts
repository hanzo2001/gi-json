///<reference path="../../typings/index.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class SwitchTypeForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		let value = <iValue>state.selectedNode();
		this.tid = 'switchTypeForm';
		this.contextData = {
			types: valueTypes,
			selectedType: 'o',
			dflt: null
		};
		this._build(state);
		this.formRoot.find('select[name=valueType]').focus();
	}
	protected updateValue(event: JQueryEventObject) {
		let value = <iValue>this.target;
		let container = <iValueContainer>value.parent();
		let oldType = value.type;
		let newType = this.formRoot.find('select[name=valueType]').val();
		if (oldType !== newType) {
			let newValue = container.setType(newType);
			this.state.navigator.clear();
			this.state.navigator.select(newValue);
		}
		this._close();
	}
}
