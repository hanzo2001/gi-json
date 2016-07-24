/// <reference path="../typings/index.d.ts" />

import {Value} from "../Nodes/Values/Value";
import {ComplexValue} from "../Nodes/Values/ComplexValue";
import {ValueContainer} from "../Nodes/ValueContainer";

export class TreeNavigator implements iTreeNavigator {
	node: iNavigatable;
	switchCb: SwitchNodeCallback;
	constructor(switchCb: SwitchNodeCallback) {
		this.switchCb = switchCb;
		this.node = null;
	}
	clear() {
		this.node = null;
	}
	select(node: iNavigatable) {
		let last = this.node;
		let next = node;
		next && (this.node = this.switchCb(next,last,'select'));
	}
	parent() {
		let last = this.node;
		let next = last.parent ? last.parent() : null;
		next && (this.node = this.switchCb(next,last,'parent'));
	}
	next() {
		let last = this.node;
		let next = last.next ? last.next() : null;
		next && (this.node = this.switchCb(next,last,'next'));
	}
	prev() {
		let last = this.node;
		let next = last.prev ? last.prev() : null;
		next && (this.node = this.switchCb(next,last,'prev'));
	}
	first() {
		let last = this.node;
		let next = last.first ? last.first() : null;
		next && (this.node = this.switchCb(next,last,'first'));
	}
	last() {
		let last = this.node;
		let next = last.last ? last.last() : null;
		next && (this.node = this.switchCb(next,last,'last'));
	}
	child(accessor: ChildAccessor) {
		let last = this.node;
		let next = last.child ? last.child(accessor) : null;
		next && (this.node = this.switchCb(next,last,'child'));
	}
}
