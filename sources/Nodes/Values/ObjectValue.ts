/// <reference path="../../typings/index.d.ts" />

import {ComplexValue} from "./ComplexValue";
import {ElementParser,clearTextNodes,nullO} from "../Utils";
import {Member} from "../Member";

export class ObjectValue extends ComplexValue implements iObjectValue {
	members: {[name:string]: iMember};
	constructor(h: iNodeHash, e: HTMLElement, f: iNodeFactory) {
		super();
		this.members = nullO();
		this.s = 0;
		this.f = f;
		this._init(h,e||'o');
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
			member = new Member(this._h,name,type,this.f);
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
			let e: HTMLElement = member.remove(true);
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
			this.members[i].remove(true);
			delete this.members[i];
		}
		this.s = 0;
		this._defaultValue(this.e);
	}
	first(): iValueContainer {
		let e = <HTMLElement>this.e.firstElementChild;
		let c = e ? this._h.get(e) : null;
		return <iValueContainer>c || null;
	}
	last(): iValueContainer {
		let e = <HTMLElement>this.e.lastElementChild;
		let c = e ? this._h.get(e) : null;
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
			this.members[i].remove(unlink);
			delete this.members[i];
		}
		return super.remove(unlink);
	}
	protected _extractValue(objectElement: HTMLElement) {
		clearTextNodes(objectElement);
		Array.prototype.forEach.call(objectElement.childNodes,function(memberElement: HTMLElement){
			let objectValue = <ObjectValue>this;
			let name: string = memberElement.firstElementChild.innerHTML;
			let member: Member = new Member(objectValue._h,name,memberElement,objectValue.f);
			this.members[name] = member;
			this.s++;
		},this);
		return null;
	}
}
