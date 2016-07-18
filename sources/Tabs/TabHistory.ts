///<reference path="../typings/iTab.d.ts" />

export class TabHistory implements iTabHistory {
	protected _i: number = 0;
	protected _h: iTabHistoryHash = Object.create(null);
	protected _c: iTabHistoryEntry = null;
	s = 0;
	getCurrent(): iTab {
		return this._c ? this._c.d : null;
	}
	addEntry(data: any): number {
		let i = this._i++;
		let c = this._c;
		let e = TabHistory._entryFactory(i,data);
		if (c) {
			c.n = e;
			e.p = c;
		}
		this._c = this._h[i] = e;
		this.s++;
		return i;
	}
	removeEntry(i: number): iTab {
		let c = this._c;
		let e = this._h[i];
		let p = e.p;
		let n = e.n;
		if (p && n) {// middle one
			p.n = n;
			n.p = p;
		} else if (p) {// last one [current]
			p.n = null;
		} else if (n) {// first one
			n.p = null;
		}
		e.p = e.n = null;
		delete this._h[i];
		this.s--;
		if (e === c) {
			this._c = c = p;
			return c ? c.d : null;
		}
		return null;
	}
	pushEntry(id): iTab {
		let c = this._c;
		let e = this._h[id];
		let p = e.p;
		let n = e.n;
		if (e === c) {return c.d;}
		if (p && n) {// middle one
			p.n = n;
			n.p = p;
		} else if (p) {// last one [current]
			p.n = null;
		} else if (n) {// first one
			n.p = null;
		}
		e.p = c;
		e.n = null;
		c.n = e;
		this._c = c = e;
		return c.d;
	}
	private static _entryFactory(i: number, data: iTab): iTabHistoryEntry {
		let e = <iTabHistoryEntry>Object.create(null);
		e.i = i;
		e.d = data;
		e.p = null;
		e.n = null;
		return e;
	}
}
