/// <reference path="../typings/index.d.ts" />

export class ProtoBase implements iProtoBase {
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
