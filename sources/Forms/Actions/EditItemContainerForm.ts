///<reference path="../../typings/iKeyboardShortcutRegistry.d.ts" />
///<reference path="../../typings/iNodeEngine.d.ts" />
///<reference path="../../typings/iGenericTreeForm.d.ts" />

import {GenericFormAction} from "./GenericFormAction";
import {valueTypes} from "../GenericTreeFormCommons";

export class EditItemContainerForm extends GenericFormAction {
	constructor(state: iTreeState) {
		super();
		let item = <iItem>state.selectedNode;
		this.tid = 'editItemContainerForm';
		let arrayValue = <iArrayValue>item.getParentValue();
		this.contextData = {
			items: (function(items: iItem[],a,s,i){
					while (i<s) {a[i] = valueTypes[items[i].getType()];i++;}
					return a;
				}(arrayValue.items,new Array(arrayValue.s),arrayValue.s,0)),
		};
		state.select(arrayValue);
		this._build(state);
	}
	protected removeItem(event: JQueryEventObject) {
		let button = <HTMLElement>event.currentTarget;
		let li = button.parentElement;
		let index = $(li).index();
		let arrayValue = <iArrayValue>this.target;
		console.log(li,index);
		arrayValue.removeItem(index);
		$(li).remove();
		if (!arrayValue.s) {this._close();}
	}
}
