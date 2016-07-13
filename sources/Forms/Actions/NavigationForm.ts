///<reference path="../../typings/index.d.ts" />

import * as $ from "jquery";
import * as Handlebars from "handlebars";
import {GenericFormAction} from "./GenericFormAction";

export class NavigationForm extends GenericFormAction {
	protected tid = 'navigationForm';
	protected state: iTreeState;
	protected isClosed: boolean = false;
	constructor(state: iTreeState) {
		super();
		console.log('NavigationForm.constructor');
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
			let c = selected.prev();
			c && this.state.select(c);
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
			let l = this.state.hash.getNode(<HTMLElement>selected.e.lastChild);
			l && this.state.select(l);
		}
	}
	protected goNext(event: JQueryEventObject) {
		let selected = <iValueContainer>this.state.selectedNode;
		if (selected.next) {
			let c = selected.next();
			c && this.state.select(c);
		} else {
			let p = <iValueContainer>selected.getParent();
			if (p && p.next) {
				let c = p.next();
				c && this.state.select(c.v);
			}
		}
	}
}
