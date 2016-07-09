///<reference path="./iNodeEngine.ts" />

var isFloatRE = /^(\+|-)?\d*[\.eE](\+|-)?\d+$/;
var isIntRE   = /^(\+|-)?\d+$/;

class ElementParser {
	static parseBool(v: string): boolean {
		if (v === 'false') {return false;}
		if (v === 'true') {return true;}
		return !!v;
	}
	static parseNumber(v: string): number {
		if (isFloatRE.test(v)) {return parseFloat(v);}
		if (isIntRE.test(v)) {return parseInt(v);}
		return NaN;
	}
}

function clearTextNodes(e: Node) {
	let c: Node = e.firstChild;
	let n: Node;
	while (c) {
		n = c.nextSibling;
		if (!(c instanceof HTMLElement)) {e.removeChild(c);}
		c = n;
	}
}

function nullO(debug?: boolean) {
	return Object.create(debug?{hasOwnPropery:Object.prototype.hasOwnProperty}:null);
}

class NodeHashFactory implements iNodeHash {
	private i: number = 0;
	private h: {[id:number]:iValue} = {};
	isRegistered(e: HTMLElement) {
		let id: number = ~~e.dataset['nid'] || 0;
		return id && !!this.h[id];
	}
	getNode(e: HTMLElement): iValue {
		let id: number = ~~e.dataset['nid'];
		return this.h[id] || null;
	}
	register(value: iValue): number {
		let id: number = ++this.i;
		this.h[id] = value;
		value.e.dataset['nid'] = id+'';
		return id;
	}
	unregister(e: HTMLElement): HTMLElement {
		let id: number = ~~e.dataset['nid'] || 0;
		if (id && this.h[id]) {
			delete this.h[id];
			delete e.dataset['nid'];
		}
		return e;
	}
}

function NodeEngineFactory(hash: iNodeHash) {
	class ProtoBase implements iProtoBase {
		e: HTMLElement;
		id: number;
		getNodeId(): number {
			return this.id;
		}
		_remove(unlink: boolean): HTMLElement {
			let e: HTMLElement = this.e;
			this.e = null;
			if (unlink) {
				e.parentNode.removeChild(e);
				hash.unregister(e);
			}
			return e;
		}
		protected _init(input: HTMLElement|string): HTMLElement {
			if (input instanceof HTMLElement) {
				this.e = input;
			} else {
				this.e = document.createElement(input);
			}
			this.id = hash.register(this);
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
		protected _init(input: HTMLElement|string): HTMLElement {
			let e: HTMLElement;
			let type: ValueType;
			if (input instanceof HTMLElement) {
				e = super._init(input);
				this.type = <ValueType>e.dataset['t'];
				this.value = this._extractValue(e);
			} else {
				e = super._init('value');
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
		constructor(e: HTMLElement) {
			super();
			this._init(e||'u');
		}
		toString() {
			return 'null';
		}
	}
	class StringValue extends Value implements iValue {
		e: HTMLElement;
		type: ValueType;
		value: string;
		constructor(e: HTMLElement) {
			super();
			this._init(e||'s');
		}
		isEditable(): boolean {
			return true;
		}
		getDisplayValue(): string {
			return this.e.innerHTML === '&nbsp;' ? '' : this.e.innerHTML;
		}
		setValue(value: string) {
			if (value === '') {
				this._defaultValue(this.e);
			} else {
				this.value = this.e.innerHTML = value;
			}
		}
		toString() {
			return '"'+this.value.replace('"','\\"')+'"';
		}
		protected _defaultValue(e: HTMLElement): string {
			e.innerHTML = '&nbsp;';
			return '';
		}
		protected _extractValue(e: HTMLElement): string {
			let value: string = e.innerHTML;
			if (value === '') {this.e.innerHTML = '&nbsp;';}
			return value === '&nbsp;' ? '' : value;
		}
	}
	class BoolValue extends Value implements iValue {
		e: HTMLElement;
		type: ValueType;
		value: boolean;
		constructor(e: HTMLElement) {
			super();
			this._init(e||'b');
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
		constructor(e: HTMLElement) {
			super();
			this._init(e||'n');
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
		constructor(e: HTMLElement) {
			super();
			this.items = [];
			this.s = 0;
			this._init(e||'a');
		}
		isComplex(): boolean {
			return true;
		}
		getItem(index: number): iValueContainer {
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
			let item: iItem = new Item(type);
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
			let item: iItem;
			let refItem: iItem = this.items[offset] || null;
			if (amount && this.isEmpty()) {clearTextNodes(this.e);}
			while (amount--) {
				item = new Item(type);
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
				let item: iItem = new Item(itemElement);
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
		constructor(e: HTMLElement) {
			super();
			this.members = nullO();
			this.s = 0;
			this._init(e||'o');
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
				member = new Member(name,type);
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
		toString() {
			let r='', i=0, k;
			if (this.s) {
				for (k in this.members) {
					r += (i?',':'')+'"'+this.members[k].getName()+'":'+this.members[k].v;
					i++;
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
				let member: iMember = new Member(name,memberElement);
				this.members[name] = member;
				this.s++;
			},this);
			return null;
		}
	}
	class ValueContainer extends ProtoBase implements iValueContainer {
		v: iValue;
		getParent(): iValue {
			let parent: iValue = <iValue>hash.getNode(this.e.parentElement);
			return parent;
		}
		getType(): ValueType {
			return this.v.type;
		}
		setType(type: ValueType): iValue {
			this.v._remove(true);
			this.v = ValueFactory(type);
			this._append(this.v);
			return this.v;
		}
		_remove(unlink: boolean): HTMLElement {
			let e: HTMLElement = this.v._remove(unlink);
			this.v = null;
			return super._remove(unlink);
		}
	}
	class Item extends ValueContainer implements iItem {
		v: iValue;
		constructor(input: HTMLElement|ValueType) {
			super();
			this._init(input);
		}
		getIndex(): number {
			let i: number = 0;
			let c: Element = this.e;
			while( (c = c.previousElementSibling) != null ) {i++;}
			return i;
		}
		protected _init(input: HTMLElement|ValueType) {
			let e: HTMLElement;
			if (input instanceof HTMLElement) {
				e = super._init(input);
				this.v = ValueFactory(<HTMLElement>e.firstChild);
			} else {
				e = super._init('item');
				this.v = ValueFactory(input);
				this._append(this.v);
			}
			return e;
		}

	}
	class Member extends ValueContainer implements iMember {
		e: HTMLElement;
		n: iMemberName;
		v: iValue;
		constructor(name: string, input: HTMLElement|ValueType) {
			super();
			let e: HTMLElement = this._init(input);
			if (input instanceof HTMLElement) {
				this.n = new MemberName(<HTMLElement>e.firstChild);
			} else {
				this.n = new MemberName(name);
				this._append(this.n,this.v);
			}
		}
		getName(): string {
			return this.n.name;
		}
		setName(name: string) {
			this.n.setName(name);
		}
		protected _init(input: HTMLElement|ValueType): HTMLElement {
			let e: HTMLElement;
			if (input instanceof HTMLElement) {
				e = super._init(input);
				this.v = ValueFactory(<HTMLElement>e.lastChild);
			} else {
				e = super._init('member');
				this.v = ValueFactory(input);
				this._append(this.v);
			}
			return e;
		}
	}
	class MemberName extends ProtoBase implements iMemberName {
		e: HTMLElement;
		name: string;
		constructor(input: HTMLElement|string) {
			super();
			if (input instanceof HTMLElement) {
				this._init(input);
				this.name = this.e.innerHTML;
			} else {
				this._init('name');
				this.name = this.e.innerHTML = input;
			}
		}
		setName(name: string) {
			this.name = this.e.innerHTML = name;
		}
	}
	function ValueFactory(input: HTMLElement|ValueType): iValue {
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
			case 'u': o = new NullValue(e);   break;
			case 's': o = new StringValue(e); break;
			case 'b': o = new BoolValue(e);   break;
			case 'n': o = new NumberValue(e); break;
			case 'a': o = new ArrayValue(e);  break;
			case 'o': o = new ObjectValue(e); break;
		}
		return o;
	}
	return {
		factory : ValueFactory,
		hash: hash
	};
}

export var NodeEngine = {
	generate: function () {return NodeEngineFactory(new NodeHashFactory());},
	parsers: ElementParser
};
