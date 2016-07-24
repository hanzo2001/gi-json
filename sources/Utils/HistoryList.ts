/// <reference path="../typings/iHistoryList.d.ts" />

interface Identifiable {
	id: number;
}

interface iHistoryEntry<T extends Identifiable> {
	i: number;
	p: iHistoryEntry<T>;
	n: iHistoryEntry<T>;
	d: T;
}

export class HistoryList<T extends Identifiable> implements iHistoryList<T> {
	protected h: {[id:number]: iHistoryEntry<T>}
	protected c: iHistoryEntry<T>;
	protected s: number;
	constructor() {
		this.h = Object.create(null);
		this.c = null;
		this.s = 0;
	}
	current(): T {
		return this.c ? this.c.d : null;
	}
	at(index: number): T {
		if (!this.s || index >= this.s) {return null;}
		if (!index) {return this.c.d;}
		if (index < 0) {while (index < 0) {index += this.s;}}
		let e = this.c;
		while (index--) {e = this.c.p;}
		return e.d;
	}
	add(d: T) {
		let e = this.entry(d);
		let p = this.c;
		e.p = p;
		if (p) {p.n = e;}
		this.h[e.i] = e;
		this.c = e;
		this.s++;
		return d;
	}
	push(d: T) {
		let e = this.h[d.id] || null;
		if (!e) {return null;}
		let c = this.c;
		if (e === c) {return c.d;}
		let p = e.p;
		let n = e.n;
		if (p && n) {// middle entry
			p.n = n;
			n.p = p;
		} else if (n) {// first entry: no previous entry
			n.p = p;
		}
		c.n = e;
		e.p = c;
		e.n = null;
		this.c = c = e;
		return c.d;
	}
	remove(d: T) {
		let e = this.h[d.id] || null;
		if (!e) {return null;}
		let c = this.c;
		let p = e.p;
		let n = e.n;
		e.p = e.n = null;
		delete this.h[e.i];
		if (p && n) {
			p.n = n;
			n.p = p;
		} else if (p) {
			p.n = n;
		} else if (n) {
			n.p = p;
		}
		if (e === c) {
			this.c = c = p;
		}
		this.s--;
		return c ? c.d : null;
	}
	protected entry(d: T) {
		let e: iHistoryEntry<T> = Object.create(null);
		e.i = d.id;
		e.d = d;
		e.p = e.n = null;
		return e;
	}
}
