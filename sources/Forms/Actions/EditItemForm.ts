///<reference path="../../typings/index.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class EditItemForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		let item = <iItem>state.selectedNode;
		this.tid = 'editItemForm';
		this.contextData = {
			types: valueTypes,
			selectedType: item.getType(),
			dflt: null
		};
		this._build(state);
		this.formRoot.find('select[name=itemType]').focus();
	}
	protected updateItem(event: JQueryEventObject) {
		let item = <iItem>this.target;
		let arrayValue = <iArrayValue>item.getParentValue();
		let oldType = item.getType();
		let newType = this.formRoot.find('select[name=itemType]').val();
		if (oldType !== newType) {item.setType(newType);}
		this._close();
	}
	protected deleteItem(event: JQueryEventObject) {
		let item = <iItem>this.target;
		let arrayValue = <iArrayValue>item.getParentValue();
		let index = item.getIndex();
		let next = item.next() || item.prev() || arrayValue;
		arrayValue.removeItem(index);
		this.state.select(next);
		this._close();
	}
}
