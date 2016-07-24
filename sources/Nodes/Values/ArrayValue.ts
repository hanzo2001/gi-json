/// <reference path="../../typings/index.d.ts" />

import {ComplexValue} from "./ComplexValue";
import {ElementParser,clearTextNodes} from "../Utils";
import {Item} from "../Item";

export class ArrayValue extends ComplexValue implements iArrayValue {
	items: iItem[];
	constructor(h: iNodeHash, e: HTMLElement, f: iNodeFactory) {
		super();
		this.items = [];
		this.s = 0;
		this.f = f;
		this._init(h,e||'a');
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
		let item = new Item(this._h,type,this.f);
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
			item = new Item(this._h,type,this.f);
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
			item.remove(true);
			this.items.splice(index,1);
			this.s--;
			if (!this.s) {this._defaultValue(this.e);}
		}
	}
	empty() {
		let i: number = this.s;
		while (i--) {this.e.removeChild(this.items[i].remove(true));}
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
		while (i--) {this.items[i].remove(unlink);}
		return super.remove(unlink);
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
			let item: Item = new Item(this._h,itemElement,this.f);
			this.items.push(item);
			this.s++;
		},this);
		return null;
	}
}
