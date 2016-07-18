///<reference path="../typings/index.d.ts" />

export class Tab implements iTab {
	hid: number = null;
	head: JQuery;
	body: JQuery;
	active: boolean;
	state: iTreeState;
	constructor(head: JQuery, body: JQuery) {
		this.head = head;
		this.body = body;
		this.active = false;
	}
	clickSelect(fn: (e: JQueryEventObject)=>iTab) {
		this.head.find('span').click(this,function(e){
			var tab = e.data;
			if (!tab.active) {
				var selected = fn(e);
				selected && selected.deselect();
				tab.select();
			}
		});
	}
	clickClose(fn: (e: JQueryEventObject)=>iTab) {
		this.head.find('button').click(this,function(e){
			var tab = e.data;
			var nextTab = fn(e);
			nextTab && nextTab.select();
			tab && tab.remove();
		});
	}
	remove() {
		if (this.head) {
			this.head.remove();
			this.body.remove();
			this.head = this.body = null;
		}
		this.active = false;
	}
	select() {
		if (this.head) {
			this.head.removeClass('hidden');
			this.body.removeClass('hidden');
		}
		this.active = true;
	}
	deselect() {
		this.head.addClass('hidden');
		this.body.addClass('hidden');
		this.active = false;
	}
}
