///<reference path="../../typings/index.d.ts" />

import * as $ from "jquery";
import {GenericFormAction} from "./GenericFormAction";
import {NodeEngine} from "../../Nodes/NodeEngine";

export class NavigationForm extends GenericFormAction {
	protected tid = 'navigationForm';
	protected state: iTreeState;
	protected isClosed: boolean = false;
	constructor(state: iTreeState) {
		super();
		this.tid = 'navigationForm';
		this.contextData = {};
		this._build(state);
	}
	protected triggerClick(event: JQueryEventObject) {
		let node = this.state.selectedNode.e;
		let e = jQuery.Event('click');
		e.target = node;
		try {
		$(this.state.treeBase).trigger(e);
		}catch(e){console.log(e);}
	}
	protected goParent(event: JQueryEventObject) {
		let selected = this.state.selectedNode;
		let e = selected.e.parentElement;
		if (e.tagName === 'DIV') {return;}
		let o = selected.getParent();
		this.state.select(o);
	}
	protected goPrev(event: JQueryEventObject) {
		let selected = <iValueContainer>this.state.selectedNode;
		if (selected.prev) {
			let c = selected.prev() || selected.getParentValue().last();
			this.state.select(c);
		} else {
			let p = <iValueContainer>selected.getParent();
			if (p && p.prev) {
				let c = p.prev();
				c && this.state.select(c.v);
			}
		}
	}
	protected goFirst(event: JQueryEventObject) {
		let selected = <iComplexValue>this.state.selectedNode;
		if (selected.first) {
			let c = selected.first();
			c && this.state.select(c);
		} else {
			let e = selected.e.lastChild;
			if (e instanceof HTMLElement) {
				let l = this.state.hash.getNode(e);
				l && this.state.select(l);
			}
		}
	}
	protected goNext(event: JQueryEventObject) {
		let selected = <iValueContainer>this.state.selectedNode;
		if (selected.next) {
			let c = selected.next() || selected.getParentValue().first();
			this.state.select(c);
		} else {
			let p = <iValueContainer>selected.getParent();
			if (p && p.next) {
				let c = p.next();
				c && this.state.select(c.v);
			}
		}
	}
	protected deleteNode(event: JQueryEventObject) {
		let selected: any = this.state.selectedNode;
		try{
		if (selected.next) {
			if (selected.getName) {
				this._deleteMember(selected);
			} else {
				this._deleteItem(selected);
			}
		} else {
			this._deleteValue(selected);
		}
		}catch(e){console.log(e);}
	}
	protected _deleteMember(c: iMember) {
		let o = <iObjectValue>c.getParentValue();
		let n = c.next() || c.prev() || c.getParentValue();
		this.state.select(n);
		o.removeMember(c.getName());
	}
	protected _deleteItem(c: iItem) {
		let o = <iArrayValue>c.getParentValue();
		let n = c.next() || c.prev() || c.getParentValue();
		this.state.select(n);
		o.removeItem(c.getIndex());
	}
	protected _deleteValue(v: iValue) {
		let c = <any>v.getParentContainer();
		if (!c) {return;}
		if (c.getIndex) {
			this._deleteItem(c);
		} else {
			this._deleteMember(c);
		}
	}
}
