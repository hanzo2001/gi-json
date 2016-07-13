///<reference path="../../typings/iKeyboardShortcutRegistry.d.ts" />
///<reference path="../../typings/iNodeEngine.d.ts" />
///<reference path="../../typings/iGenericTreeForm.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class AddItemForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		let arrayValue = <iArrayValue>state.selectedNode;
		this.tid = 'addItemForm';
		this.contextData = {
			types: valueTypes,
			selectedType: 'u',
			dflt: null,
			itemOffset: arrayValue.s
		};
		this._build(state);
		this.formRoot.find('select[name=itemType]').focus();
	}
	protected createItem(event: JQueryEventObject) {
		let typeInput = this.formRoot.find('select[name=itemType]');
		let amountInput = this.formRoot.find('input[name=itemAmount]');
		let offsetInput = this.formRoot.find('input[name=itemOffset]');
		let type = typeInput.val();
		let amount = ~~amountInput.val();
		let offset = ~~offsetInput.val();
		let arrayValue = <iArrayValue>this.target;
		if (!amount || amount === 1) {
			arrayValue.addItem(type,offset);
		} else {
			arrayValue.addItems(amount,type,offset);
		}
		offsetInput.val(arrayValue.s);
		amountInput.val('1');
		typeInput.focus();
	}
}
