///<reference path="../../typings/index.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {complexTypes} from "../GenericTreeFormCommons";

export class StartTreeForm extends GenericFormAction {
	protected state: iTreeState;
	constructor(state: iTreeState) {
		super();
		this.tid = 'startTreeForm';
		this.contextData = {
			types: complexTypes,
			selectedType: 'o',
			dflt: null
		};
		this._build(state);
		this.formRoot.find('select[name=rootType]').focus();
	}
	protected createRoot(event: JQueryEventObject) {
		let type = <ValueType>this.formRoot.find('select[name=rootType]').val();
		//let value = this.state.factory(type);
		this.state.setRoot(type);
		this._close();
	}
}
