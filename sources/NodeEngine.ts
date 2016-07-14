///<reference path="./typings/iNodeEngine.d.ts" />
///<reference path="./typings/iNodeHash.d.ts" />

import {ElementParser,clearTextNodes,nullO} from 'NodeEngineUtils';

class ProtoBase implements iProtoBase {
	e: HTMLElement;
	id: number;
	protected _h: iNodeHash;
	getParent(): iProtoBase {
		let parent: iProtoBase = <iProtoBase>this._h.getNode(this.e.parentElement);
		return parent;
	}
	getNodeId(): number {
		return this.id;
	}
	_remove(unlink: boolean): HTMLElement {
		let e: HTMLElement = this.e;
		this.e = null;
		if (unlink) {
			e.parentNode.removeChild(e);
			this._h.unregister(e);
			this._h = null;
		}
		return e;
	}
	protected _init(h: iNodeHash, input: HTMLElement|string): HTMLElement {
		this._h = h;
		if (input instanceof HTMLElement) {
			this.e = input;
		} else {
			this.e = document.createElement(input);
		}
		this.id = this._h.register(this);
		return this.e;
	}
	protected _append(c: iProtoBase, b?: iProtoBase) {
		this.e.insertBefore(c.e,b?b.e:null);
	}
}
class Value extends ProtoBase implements iValue {
	e: HTMLElement;
	type: ValueType;
	value: ValueContent;
	getParentContainer(): iValueContainer {
		let parentTag = this.e.parentElement.tagName;
		return parentTag === 'ITEM' || parentTag === 'MEMBER' ? <iValueContainer>this.getParent() : null;
	}
	isEmpty(): boolean {
		return this.e.innerHTML === '&nbsp;';
	}
	isEditable(): boolean {
		return false;
	}
	isComplex(): boolean {
		return false;
	}
	getValue(): ValueContent {
		return this.value;
	}
	getDisplayValue(): string {
		return '';
	}
	setValue(value: ValueContent) {}
	resetValue() {
		this._defaultValue(this.e);
		return this.e;
	}
	protected _init(h: iNodeHash, input: HTMLElement|string): HTMLElement {
		let e: HTMLElement;
		let type: ValueType;
		if (input instanceof HTMLElement) {
			e = super._init(h,input);
			this.type = <ValueType>e.dataset['t'];
			this.value = this._extractValue(e);
		} else {
			e = super._init(h,'value');
			e.dataset['t'] = input;
			this.type = <ValueType>input;
			this.value = this._defaultValue(e);
		}
		return e;
	}
	protected _defaultValue(e: HTMLElement): ValueContent {
		e.innerHTML = '&nbsp;';
		return null;
	}
	protected _extractValue(e: HTMLElement): ValueContent {
		return null;
	}
}

class NullValue extends Value implements iValue {
	e: HTMLElement;
	type: ValueType;
	value: ValueContent;
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this._init(h,e||'u');
	}
	toString() {
		return 'null';
	}
}
class StringValue extends Value implements iValue {
	e: HTMLElement;
	type: ValueType;
	value: string;
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this._init(h,e||'s');
	}
	isEditable(): boolean {
		return true;
	}
	getDisplayValue(): string {
		return this.e.innerHTML === '&nbsp;' ? '' : this.e.innerHTML;
	}
	setValue(value: string) {
		if (value === '') {
			this.value = this._defaultValue(this.e);
		} else {
			this.e.innerHTML = ElementParser.str2html(value);
			this.value = value;
		}
	}
	toString() {
		let value = ElementParser.str2json(this.value);
		return '"'+value+'"';
	}
	protected _defaultValue(e: HTMLElement): string {
		e.innerHTML = '&nbsp;';
		return '';
	}
	protected _extractValue(e: HTMLElement): string {
		let value: string = e.innerHTML;
		if (value === '') {this.e.innerHTML = '&nbsp;';}
		return value === '&nbsp;' ? '' : ElementParser.html2str(value);
	}
}
class BoolValue extends Value implements iValue {
	e: HTMLElement;
	type: ValueType;
	value: boolean;
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this._init(h,e||'b');
	}
	getDisplayValue(): string {
		return this.e.innerHTML;
	}
	setValue(input: ValueContent) {
		if (typeof(input) === 'string') {
			this.value = ElementParser.parseBool(<string>input);
		} else {
			this.value = !!input;
		}
		this.e.innerHTML = this.value ? 'true' : 'false';
	}
	toString() {
		return this.e.innerHTML;
	}
	protected _defaultValue(e: HTMLElement): boolean {
		e.innerHTML = 'false';
		return false;
	}
	protected _extractValue(e: HTMLElement): boolean {
		let value: boolean = ElementParser.parseBool(e.innerHTML);
		e.innerHTML = value ? 'true' : 'false';
		return value;
	}
}
class NumberValue extends Value implements iValue {
	e: HTMLElement;
	type: ValueType;
	value: number;
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this._init(h,e||'n');
	}
	getDisplayValue(): string {
		return this.e.innerHTML;
	}
	setValue(input: string) {
		this.value = ElementParser.parseNumber(input);
		if (isNaN(this.value)) {
			this.value = this._defaultValue(this.e);
		} else {
			this.e.innerHTML = input;
		}
	}
	isEditable(): boolean {
		return true;
	}
	toString() {
		return this.e.innerHTML;
	}
	protected _defaultValue(e: HTMLElement): number {
		e.innerHTML = '0';
		return 0;
	}
	protected _extractValue(e: HTMLElement): number {
		let value: number = ElementParser.parseNumber(e.innerHTML)
		if (isNaN(value)) {
			return this._defaultValue(e);
		}
		return value;
	}
}

class ArrayValue extends Value implements iArrayValue {
	e: HTMLElement;
	type: ValueType;
	value: ValueContent;
	items: iItem[];
	s: number;
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this.items = [];
		this.s = 0;
		this._init(h,e||'a');
	}
	isComplex(): boolean {
		return true;
	}
	getItem(index: number): iItem {
		return this.items[index] || null;
	}
	getItemValue(index: number): iValue {
		return this.items[index] ? this.items[index].v : null;
	}
	addItem(type: ValueType, offset?: number): iValue {
		if (offset === undefined || offset > this.s) {offset = this.s;}
		else
		if (offset < 0) {
			if (!this.s) {offset = 0;}
			while (offset < 0) {offset += this.s;}
		}
		let item = new Item(this._h,type);
		let refItem: iItem = this.items[offset] || null;
		this.items.splice(offset,0,item);
		if (this.isEmpty()) {clearTextNodes(this.e);}
		this._append(item,refItem);
		this.s++;
		return item.v;
	}
	addItems(amount: number, type: ValueType, offset?: number): iValue[] {
		if (offset === undefined || offset > this.s) {offset = this.s;}
		else
		if (offset < 0) {
			if (!this.s) {offset = 0;}
			while (offset < 0) {offset += this.s;}
		}
		let a: iValue[] = [];
		let item: Item;
		let refItem: iItem = this.items[offset] || null;
		if (amount && this.isEmpty()) {clearTextNodes(this.e);}
		while (amount--) {
			item = new Item(this._h,type);
			a.push(item.v);
			this.items.splice(offset++,0,item);
			this._append(item,refItem);
		}
		this.s += a.length;
		return a;
	}
	removeItem(index: number) {
		let item: iItem = this.items[index];
		if (item) {
			item._remove(true);
			this.items.splice(index,1);
			this.s--;
			if (!this.s) {this._defaultValue(this.e);}
		}
	}
	empty() {
		let i: number = this.s;
		while (i--) {this.e.removeChild(this.items[i]._remove(true));}
		this.s = 0;
		this.items = [];
		this._defaultValue(this.e);
	}
	first(): iValueContainer {
		return this.items[0] || null;
	}
	last(): iValueContainer {
		return this.items[this.s-1] || null;
	}
	_remove(unlink: boolean) {
		let i: number = this.s;
		while (i--) {this.items[i]._remove(unlink);}
		return super._remove(unlink);
	}
	toString() {
		let r='', i=0;
		if (this.s) {
			r += this.items[i++].v+'';
			for (; i<this.s; i++) {
				r += ','+this.items[i].v;
			}
		}
		return '['+r+']';
	}
	protected _extractValue(arrayElement: HTMLElement): ValueContent {
		clearTextNodes(arrayElement);
		Array.prototype.forEach.call(arrayElement.childNodes,function(itemElement: HTMLElement){
			let item: Item = new Item(this._h,itemElement);
			this.items.push(item);
			this.s++;
		},this);
		return null;
	}
}
class ObjectValue extends Value implements iObjectValue {
	e: HTMLElement;
	type: ValueType;
	value: ValueContent;
	members: {[name:string]: iMember};
	s: number;
	constructor(h: iNodeHash, e: HTMLElement) {
		super();
		this.members = nullO();
		this.s = 0;
		this._init(h,e||'o');
	}
	isComplex(): boolean {
		return true;
	}
	getMember(name: string): iMember {
		return this.members[name] || null;
	}
	getMemberValue(name: string): iValue {
		return this.members[name] ? this.members[name].v : null;
	}
	getMemberNames(): string[] {
		let i: string;
		let a: string[] = [];
		for (i in this.members) {a.push(i);}
		return a;
	}
	addMember(name: string, type: ValueType): iValue {
		let member: iMember = this.members[name];
		if (!member) {
			member = new Member(this._h,name,type);
			this.members[name] = member;
			if (!this.s) {clearTextNodes(this.e);}
			this._append(member);
			this.s++;
		}
		return member ? member.v : null;
	}
	removeMember(name: string) {
		let member: iMember = this.members[name];
		if (member) {
			let e: HTMLElement = member._remove(true);
			delete this.members[name];
			this.s--;
			if (!this.s) {this._defaultValue(this.e);}
		}
	}
	renameMember(oldName: string, newName: string) {
		let member: iMember = this.members[oldName];
		if (member && !this.members[newName]) {
			member.setName(newName);
			this.members[newName] = member;
			delete this.members[oldName];
		}
	}
	empty() {
		let i: string;
		for (i in this.members) {
			this.members[i]._remove(true);
			delete this.members[i];
		}
		this.s = 0;
		this._defaultValue(this.e);
	}
	first(): iValueContainer {
		let e = <HTMLElement>this.e.firstElementChild;
		let c = e ? this._h.getNode(e) : null;
		return <iValueContainer>c || null;
	}
	last(): iValueContainer {
		let e = <HTMLElement>this.e.lastElementChild;
		let c = e ? this._h.getNode(e) : null;
		return <iValueContainer>c || null;
	}
	toString() {
		let r='', i=0, k;
		if (this.s) {
			for (k in this.members) {
				r += (i++?',':'')+this.members[k];
			}
		}
		return '{'+r+'}';
	}
	_remove(unlink: boolean) {
		let i: string;
		for (i in this.members) {
			this.members[i]._remove(unlink);
			delete this.members[i];
		}
		return super._remove(unlink);
	}
	protected _extractValue(objectElement: HTMLElement) {
		clearTextNodes(objectElement);
		Array.prototype.forEach.call(objectElement.childNodes,function(memberElement: HTMLElement){
			let name: string = memberElement.firstElementChild.innerHTML;
			let member: Member = new Member(this._h,name,memberElement);
			this.members[name] = member;
			this.s++;
		},this);
		return null;
	}
}
class ValueContainer extends ProtoBase implements iValueContainer {
	v: iValue;
	getParentValue(): iComplexValue {
		return <any>this.getParent();
	}
	getType(): ValueType {
		return this.v.type;
	}
	setType(type: ValueType): iValue {
		this.v._remove(true);
		this.v = NodeEngine(this._h,type);
		this._append(this.v);
		return this.v;
	}
	prev(): iValueContainer {
		let e = <HTMLElement>this.e.previousElementSibling;
		let c = e ? this._h.getNode(e) : null;
		return <iValueContainer>c;
	}
	next(): iValueContainer {
		let e = <HTMLElement>this.e.nextElementSibling;
		let c = e ? this._h.getNode(e) : null;
		return <iValueContainer>c;
	}
	_remove(unlink: boolean): HTMLElement {
		let e: HTMLElement = this.v._remove(unlink);
		this.v = null;
		return super._remove(unlink);
	}
}
class Item extends ValueContainer implements iItem {
	v: iValue;
	constructor(h: iNodeHash, input: HTMLElement|ValueType) {
		super();
		this._init(h,input);
	}
	getIndex(): number {
		let i: number = 0;
		let c: Element = this.e;
		while( (c = c.previousElementSibling) != null ) {i++;}
		return i;
	}
	protected _init(h: iNodeHash, input: HTMLElement|ValueType) {
		let e: HTMLElement;
		if (input instanceof HTMLElement) {
			e = super._init(h,input);
			this.v = NodeEngine(h,<HTMLElement>e.firstChild);
		} else {
			e = super._init(h,'item');
			this.v = NodeEngine(h,input);
			this._append(this.v);
		}
		return e;
	}

}
class Member extends ValueContainer implements iMember {
	e: HTMLElement;
	n: iMemberName;
	v: iValue;
	constructor(h: iNodeHash, name: string, input: HTMLElement|ValueType) {
		super();
		let e: HTMLElement = this._init(h,input);
		if (input instanceof HTMLElement) {
			this.n = new MemberName(h,<HTMLElement>e.firstChild);
		} else {
			this.n = new MemberName(h,name);
			this._append(this.n,this.v);
		}
	}
	getName(): string {
		return this.n.name;
	}
	setName(name: string) {
		this.n.setName(name);
	}
	toString() {
		return '"'+ElementParser.str2json(this.n+'')+'":'+this.v;
	}
	protected _init(h: iNodeHash, input: HTMLElement|ValueType): HTMLElement {
		let e: HTMLElement;
		if (input instanceof HTMLElement) {
			e = super._init(h,input);
			this.v = NodeEngine(h,<HTMLElement>e.lastChild);
		} else {
			e = super._init(h,'member');
			this.v = NodeEngine(h,input);
			this._append(this.v);
		}
		return e;
	}
}
class MemberName extends ProtoBase implements iMemberName {
	e: HTMLElement;
	name: string;
	constructor(h: iNodeHash, input: HTMLElement|string) {
		super();
		if (input instanceof HTMLElement) {
			this._init(h,input);
			this.name = ElementParser.html2str(this.e.innerHTML);
		} else {
			this._init(h,'name');
			this.name = input;
			this.e.innerHTML = ElementParser.str2html(input);
		}
	}
	setName(name: string) {
		this.name = this.e.innerHTML = name;
	}
	toString(): string {
		return this.name;
	}
}

export function NodeEngine(h: iNodeHash, input: HTMLElement|ValueType): iValue {
	let e: HTMLElement = null;
	let type: ValueType;
	let o: iValue;
	if (input instanceof HTMLElement) {
		e = input;
		type = <ValueType>e.dataset['t'];
	} else {
		type = input;
		if (!type) {type = 'u';}
	}
	switch (type) {
		case 'u': o = new NullValue(h,e);   break;
		case 's': o = new StringValue(h,e); break;
		case 'b': o = new BoolValue(h,e);   break;
		case 'n': o = new NumberValue(h,e); break;
		case 'a': o = new ArrayValue(h,e);  break;
		case 'o': o = new ObjectValue(h,e); break;
	}
	return o;
}
