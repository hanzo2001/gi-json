///<reference path="../../typings/index.d.ts" />
///<reference path="../../../typings/index.d.ts" />

import * as $ from 'jquery';

export abstract class GenericFormAction implements iGenericFormAction {
	protected contextData: any;
	protected state: iTreeState;
	protected form: iGenericTreeForm;
	protected formRoot: JQuery;
	protected target: NodeEngineTarget;
	protected kbsManager: iKeyboardShortcutRegistry;
	protected tid: string;
	protected _build(state: iTreeState) {
		this.state = state;
		this.form = state.form;
		this.form.show(this.contextData);
		this.formRoot = this.form.get();
		this.target = <NodeEngineTarget>state.selectedNode;
		this.kbsManager = state.kbsRegister;
		this.formRoot.find('[data-action]').each(this._attachButtonEvent.bind(this));
	}
	protected _attachButtonEvent(i: number, button: HTMLElement){
		let action = button.dataset['action'];
		let kbs = ~~(button.dataset['kbs'] || null);
		let cb = this[action] || null;
		if (cb) {
			cb = cb.bind(this);
			$(button).click(cb);
			if (kbs) {this.kbsManager.registerShortcut(kbs,cb);}
		}
	}
	protected _close() {
		this.kbsManager && this.kbsManager.unregisterShortcut();
		this.form && this.form.remove();
		this.contextData = null;
		this.form = null;
		this.formRoot = null;
		this.target = null;
		this.kbsManager = null;
		this.state.form = null;
		this.state.formControl = null;
		if (!this.state.navigating) {this.state.navigate();}
	}
	closeForm() {
		this._close();
	}
}
