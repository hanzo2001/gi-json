///<reference path="../typings/index.d.ts" />

import * as $ from "jquery";
import {NodeEngine} from "./NodeEngine";
import * as Handlebars from "handlebars";
import "helpers";

var rootElement: HTMLElement;
var treeRoot: HTMLElement;

var debug;
var data = {active:true};

var showTemplate: (id: string, target: HTMLElement, data: Object) => JQuery;

interface iTreeNodeForm {
	build(o?: any);
	closeForm();
}

interface iState {
	formBase: HTMLElement;
	treeBase: HTMLElement;
	rootElement: HTMLElement;
	rootValue: iValue;
	controlForm: iTreeNodeForm,
	clickEventsAllowed: boolean;
	blockClicks();
	allowClicks();
}

var state: iState = {
	formBase: null,
	// the working area
	treeBase: null,
	// the root nodeElement of the tree
	rootElement: null,
	// the root Value of the tree. :: value.e.parentElement => rootElement 
	rootValue: null,
	controlForm: null,
	clickEventsAllowed : false,
	blockClicks: function () {
		this.clickEventsAllowed = false;
	},
	allowClicks: function () {
		this.clickEventsAllowed = true;
	}
};

showTemplate = (function(state){
	var cache: {[id:string]: HandlebarsTemplateDelegate} = {};
	return function (id: string, target: HTMLElement, data: Object): JQuery {
		var html: JQuery;
		var script: HandlebarsTemplateDelegate = cache[id];
		if (!script) {
			cache[id] = script = Handlebars.compile($('#'+id).html());
		}
		html = $(script(data));
		$(target).append(html);
		state.blockClicks(function(){html.remove();});
		return html;
	}
}(state));

var Nodes = NodeEngine.generate();
var Hash = Nodes.hash;

var primitiveTypes = {
	u: 'null',
	s: 'string',
	b: 'bool',
	n: 'number',
};
var complexTypes = {
	a: 'array',
	o: 'object'
};

var valueTypes = $.extend(Object.create(null),primitiveTypes,complexTypes);

var factory = Nodes.factory;

function clickMember(event: JQueryEventObject) {
	event.stopPropagation();
	let memberElement: HTMLElement = this;
	let state = <iState>event.data;
	let controlForm = state.controlForm;
	if (controlForm) {controlForm.closeForm();}
	controlForm = new EditMemberContainerForm(state);
	controlForm.build(<iMember>Hash.getNode(memberElement));
	state.controlForm = controlForm;
}
function clickItem(event: JQueryEventObject) {
	event.stopPropagation();
	let itemElement: HTMLElement = this;
	let state = <iState>event.data;
	let controlForm = state.controlForm;
	if (controlForm) {controlForm.closeForm();}
	controlForm = new EditItemContainerForm(state);
	controlForm.build(<iItem>Hash.getNode(itemElement));
	state.controlForm = controlForm;
}
function clickName(event: JQueryEventObject) {
	event.stopPropagation();
	let name: HTMLElement = this;
	let member: HTMLElement = name.parentElement;
	let controlForm = state.controlForm;
	if (controlForm) {controlForm.closeForm();}
	controlForm = new EditMemberForm(state);
	controlForm.build(<iMember>Hash.getNode(member));
	state.controlForm = controlForm;
}
function clickValue(event: JQueryEventObject) {
	event.stopPropagation();
	let valueElement: HTMLElement = this;
	let controlForm = state.controlForm;
	if (controlForm) {controlForm.closeForm();}
	state.controlForm = controlForm = null;
	let value = <iValue>Hash.getNode(valueElement);
	let type: ValueType = value.type;
	switch (type) {
		case 'u': controlForm = new SwitchTypeForm(state); break;
		case 'b': toggleBoolValue(value); break;
		case 's': controlForm = new EditableValueForm(state); break;
		case 'n': controlForm = new EditableValueForm(state); break;
		case 'o': controlForm = new AddMemberForm(state); break;
		case 'a': controlForm = new AddItemForm(state); break;
	}
	state.controlForm = controlForm;
	controlForm && controlForm.build(value);
}

function toggleBoolValue(value: iValue) {
	value.setValue(!value.getValue());
}

function loadEditValueForm(value: iValue) {
	let type: ValueType = value.type;
	switch (type) {
		case 'u': return (new SwitchTypeForm(state)).build(value);
		case 'b': return toggleBoolValue(value);
		case 's': return (new EditableValueForm(state)).build(value);
		case 'n': return (new EditableValueForm(state)).build(value);
		case 'o': return (new AddMemberForm(state)).build(<iObjectValue>value);
		case 'a': return (new AddItemForm(state)).build(<iArrayValue>value);
	}
}

abstract class TreeNodeForm implements iTreeNodeForm {
	tid: string = '';
	state: iState;
	form: JQuery;
	protected _buttons: {[id:number]: HTMLElement} = {};
	protected _keyCodes: {[code:number]: number} = {};
	protected _sid: number = 0;
	protected _formContextData: any;
	constructor(state: iState) {
		this.state = state;
	}
	build(o?: any) {}
	protected _build() {
		this.state.controlForm = this;
		this.form = showTemplate(this.tid,this.state.formBase,this._formContextData);
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
}

class AddItemForm extends TreeNodeForm {
	tid = 'addItemForm';
	arrayValue: iArrayValue;
	build(arrayValue: iArrayValue) {
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

class EditItemContainerForm extends TreeNodeForm {
	tid = 'editItemContainerForm';
	item: iItem;
	arrayValue: iArrayValue;
	build(item: iItem) {
		this.item = item;
		this.arrayValue = <iArrayValue>item.getParent();
		this._formContextData = {
			items: (function(items: iItem[],a,s,i){
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

class AddMemberForm extends TreeNodeForm {
	tid = 'addMemberForm';
	objectValue: iObjectValue;
	build(objectValue: iObjectValue) {
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

class EditMemberContainerForm extends TreeNodeForm {
	tid = 'editMemberContainerForm';
	member: iMember;
	objectValue: iObjectValue;
	build(member: iMember) {
		this.member = member;
		this.objectValue = <iObjectValue>member.getParent();
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

class EditMemberForm extends TreeNodeForm {
	tid = 'editMemberForm';
	member: iMember;
	build(member: iMember) {
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
		let objectValue: iObjectValue = <iObjectValue>this.member.getParent();
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
		let member: iMember = data.member;
		let name = member.getName();
		let objectValue: iObjectValue = <iObjectValue>member.getParent();
		objectValue.removeMember(name);
		this.closeForm();
	}
}

class SwitchTypeForm extends TreeNodeForm {
	tid = 'switchTypeForm';
	value: iValue;
	build(value: iValue) {
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
		let container = <iValueContainer>Hash.getNode(this.value.e.parentElement);
		let oldType = this.value.getDisplayValue();
		let newType = this.form.find('select[name=valueType]').val();
		if (oldType !== newType) {container.setType(newType);}
		this.closeForm();
	}
}

class EditableValueForm extends TreeNodeForm {
	tid = 'editableValueForm';
	value: iValue;
	build(value: iValue) {
		this.value = value;
		this._formContextData = {
			value : value.getDisplayValue()
		};
		super._build();
	}
	updateValue(event: JQueryEventObject) {
		let oldValue = this.value.getDisplayValue();
		let newValue = this.form.find('input[name=value]').val();
		if (oldValue !== newValue) {this.value.setValue(newValue);}
		this.closeForm();
	}
}

class StartTreeForm extends TreeNodeForm {
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
		let value = factory(type);
		this.state.rootValue = value;
		this.state.rootElement = value.e;
		this.state.treeBase.appendChild(state.rootValue.e);
		this.closeForm();
	}
}

$(function(){
	try {
		state.treeBase = document.getElementById('treeBase');
		state.formBase = document.getElementById('formBase');
		state.rootElement = <HTMLElement>state.treeBase.childNodes.item(1);
		if (state.rootElement) {
			state.rootValue = factory(state.rootElement);
		} else {
			(new StartTreeForm(state)).build();
			//loadStartTreeForm(state.treeBase);
		}
		$(state.treeBase)
			.on('click','member',state,clickMember)
			.on('click','item',  state,clickItem)
			.on('click','name',  state,clickName)
			.on('click','value', state,clickValue);
		$('#outputJSON')
			.click(state,function(event: JQueryEventObject){
				if (event.data.rootValue) {$('#jsonOutput').text(event.data.rootValue+'');}
			});
		window.t = state.rootValue;
	} catch (e) {
		console.log(e);
	}
});
