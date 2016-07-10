///<reference path="./typings/TreeForms.d.ts" />
///<reference path="./typings/TreeState.d.ts" />
///<reference path="./typings/NodeHash.d.ts" />
///<reference path="./typings/NodeEngine.d.ts" />

import * as $ from "jquery";
import * as Handlebars from "handlebars";

export var primitiveTypes = {
	u: 'null',
	s: 'string',
	b: 'bool',
	n: 'number',
};
export var complexTypes = {
	a: 'array',
	o: 'object'
};
export var valueTypes = $.extend(Object.create(null),primitiveTypes,complexTypes);

abstract class TreeForm implements TreeForm {
	tid: string = '';
	state: TreeState;
	form: JQuery;
	protected _buttons: {[id:number]: HTMLElement} = {};
	protected _keyCodes: {[code:number]: number} = {};
	protected _sid: number = 0;
	protected _formContextData: any;
	private cache: {[id:number]: HandlebarsTemplateDelegate} = {};
	constructor(state: TreeState) {
		this.state = state;
	}
	build(o?: any) {}
	protected _build() {
		this.state.controlForm = this;
		this.form = this.showTemplate(this.tid,this.state.formBase,this._formContextData);
		let behaviors = this.form.data('behavior');
		if (behaviors) {
			behaviors.split(' ').forEach(function(mth:string){this[mth]();},this);
		}
		let buttons = this.form.find('button[data-action]');
		buttons.each(this._attachButtonEvent.bind(this));
		this._attachKeyboardShortcuts();
	}
	closeForm() {
		if (this._sid) {$(document).off('keyup.'+this.tid);}
		this.state.controlForm = null;
		this.form.remove();
		this.allowClicks();
	}
	protected blockClicks() {
		this.state.blockClicks();
	}
	protected allowClicks() {
		this.state.allowClicks();
	}
	protected _attachButtonEvent(i: number, button: HTMLElement){
		let action = button.dataset['action'];
		let cb = this[action] || null;
		if (cb) {
			$(button).click(cb.bind(this));
			let keyCode = ~~button.dataset['kbs'];
			if (keyCode) {
				this._sid++;
				this._buttons[this._sid] = button;
				this._keyCodes[keyCode] = this._sid;
			}
		}
	}
	protected _attachKeyboardShortcuts() {
		if (this._sid) {
			let data = {
				k: this._keyCodes,
				b: this._buttons
			};
			$(document).on('keyup.'+this.tid,data,function(event: JQueryEventObject){
				let data = event.data;
				let id = data.k[event.keyCode];
				id && $(data.b[id]).click();
			});
		}
	}
	protected showTemplate(id: string, target: HTMLElement, data: Object): JQuery {
			var html: JQuery;
			var script: HandlebarsTemplateDelegate = this.cache[id];
			if (!script) {
				this.cache[id] = script = Handlebars.compile($('#'+id).html());
			}
			html = $(script(data));
			$(target).append(html);
			this.state.blockClicks();
			return html;
	}
}

export class AddItemForm extends TreeForm {
	tid = 'addItemForm';
	arrayValue: ArrayValue;
	build(arrayValue: ArrayValue) {
		this.arrayValue = arrayValue;
		this._formContextData = {
			types: valueTypes,
			selectedType: 'u',
			dflt: null,
			itemOffset: arrayValue.s
		};
		super._build();
		this.form.find('select[name=itemType]').focus();
	}
	protected createItem(event: JQueryEventObject) {
		let typeInput = this.form.find('select[name=itemType]');
		let amountInput = this.form.find('input[name=itemAmount]');
		let offsetInput = this.form.find('input[name=itemOffset]');
		let type = typeInput.val();
		let amount = ~~amountInput.val();
		let offset = ~~offsetInput.val();
		if (!amount || amount === 1) {
			this.arrayValue.addItem(type,offset);
		} else {
			this.arrayValue.addItems(amount,type,offset);
		}
		offsetInput.val(this.arrayValue.s);
		amountInput.val('1');
		typeInput.focus();
	}
}

export class EditItemContainerForm extends TreeForm {
	tid = 'editItemContainerForm';
	item: Item;
	arrayValue: ArrayValue;
	build(item: Item) {
		this.item = item;
		this.arrayValue = <ArrayValue>item.getParent();
		this._formContextData = {
			items: (function(items: Item[],a,s,i){
					while (i<s) {a[i] = valueTypes[items[i].getType()];i++;}
					return a;
				}(this.arrayValue.items,new Array(this.arrayValue.s),this.arrayValue.s,0)),
			id: this.arrayValue.getNodeId()
		};
		super._build();
	}
	protected removeItem(event: JQueryEventObject) {
		let button = <HTMLElement>event.currentTarget;
		let li = button.parentElement;
		let index = $(li).index();
		console.log(li,index);
		this.arrayValue.removeItem(index);
		$(li).remove();
		if (!this.arrayValue.s) {this.closeForm();}
	}
}

export class AddMemberForm extends TreeForm {
	tid = 'addMemberForm';
	objectValue: ObjectValue;
	build(objectValue: ObjectValue) {
		this.objectValue = objectValue;
		this._formContextData = {
			types: valueTypes,
			selectedType: 'u',
			dflt: null
		};
		super._build();
		this.form.find('input[name=memberName]').focus();
	}
	protected createMember(event: JQueryEventObject) {
		let memberNameElement = this.form.find('input[name=memberName]');
		let name = memberNameElement.val();
		if (name && !/[^\w-]/.test(name)) {
			let type = this.form.find('select[name=memberType]').val();
			this.objectValue.addMember(name,type);
		}
		memberNameElement.val('');
		memberNameElement.focus();
	}
}

export class EditMemberContainerForm extends TreeForm {
	tid = 'editMemberContainerForm';
	member: Member;
	objectValue: ObjectValue;
	build(member: Member) {
		this.member = member;
		this.objectValue = <ObjectValue>member.getParent();
		this._formContextData = {
			members: this.objectValue.getMemberNames()
		};
		super._build();
	}
	protected removeMember(event: JQueryEventObject) {
		let button = <HTMLElement>event.currentTarget;
		let li = button.parentElement;
		let name = button.dataset['memberName'];
		this.objectValue.removeMember(name);
		$(button).remove();
		$(li).remove();
		if (!this.objectValue.s) {
			this.closeForm();
		}
	}
}

export class EditMemberForm extends TreeForm {
	tid = 'editMemberForm';
	member: Member;
	build(member: Member) {
		this.member = member;
		this._formContextData = {
			name: member.getName(),
			types: valueTypes,
			selectedType: member.v.type,
			dflt: null
		};
		super._build();
		this.form.find('select[name=memberType]').focus();
	}
	protected updateMember(event: JQueryEventObject) {
		let objectValue: ObjectValue = <ObjectValue>this.member.getParent();
		let oldName = this.member.getName();
		let oldType = this.member.getType();
		let newNameInput = this.form.find('input[name=memberName]');
		let newName = newNameInput.val();
		if (newName && !/[^\w-]/.test(newName)) {
			let newType = this.form.find('select[name=memberType]').val();
			if (oldName !== newName) {objectValue.renameMember(oldName,newName);}
			if (oldType !== newType) {this.member.setType(newType);}
			this.closeForm();
		} else {
			newNameInput.focus();
		}
	}
	protected deleteMember(event: JQueryEventObject) {
		let data = event.data;
		let member: Member = data.member;
		let name = member.getName();
		let objectValue: ObjectValue = <ObjectValue>member.getParent();
		objectValue.removeMember(name);
		this.closeForm();
	}
}

export class SwitchTypeForm extends TreeForm {
	tid = 'switchTypeForm';
	value: Value;
	build(value: Value) {
		this.value = value;
		this._formContextData = {
			types: valueTypes,
			selectedType: 'o',
			dflt: null
		};
		super._build();
		this.form.find('select[name=valueType]').focus();
	}
	updateValue(event: JQueryEventObject) {
		let container = <ValueContainer>this.state.hash.getNode(this.value.e.parentElement);
		let oldType = this.value.getDisplayValue();
		let newType = this.form.find('select[name=valueType]').val();
		if (oldType !== newType) {container.setType(newType);}
		this.closeForm();
	}
}

export class EditableValueForm extends TreeForm {
	tid = 'editableValueForm';
	value: Value;
	build(value: Value) {
		this.value = value;
		this._formContextData = {
			value : value.getDisplayValue()
		};
		super._build();
		this.form.find('input[name=value]').focus();
	}
	updateValue(event: JQueryEventObject) {
		let oldValue = this.value.getDisplayValue();
		let newValue = this.form.find('input[name=value]').val();
		if (oldValue !== newValue) {this.value.setValue(newValue);}
		this.closeForm();
	}
}

export class StartTreeForm extends TreeForm {
	tid = 'startTreeForm';
	build() {
		this._formContextData = {
			types: complexTypes,
			selectedType: 'o',
			dflt: null
		};
		super._build();
	}
	protected createRoot(event: JQueryEventObject) {
		let type: ValueType = this.form.find('select[name=rootType]').val();
		let value = this.state.factory(type);
		this.state.rootValue = value;
		this.state.rootElement = value.e;
		this.state.treeBase.appendChild(this.state.rootValue.e);
		this.closeForm();
	}
}
