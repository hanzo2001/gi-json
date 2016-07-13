///<reference path="../../typings/iKeyboardShortcutRegistry.d.ts" />
///<reference path="../../typings/iNodeEngine.d.ts" />
///<reference path="../../typings/iGenericTreeForm.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class SwitchTypeForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		let value = <iValue>state.selectedNode;
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
		let container = <iValueContainer>value.getParentContainer();
		let oldType = value.getDisplayValue();
		let newType = this.formRoot.find('select[name=valueType]').val();
		if (oldType !== newType) {
			this.state.select(container.setType(newType));
		}
		this._close();
	}
}
