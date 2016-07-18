/// <reference path="../typings/index.d.ts" />

export var isFloatRE = /^-?(0|[1-9]\d*)(((\.\d+)|([eE]-?\d+))|(\.\d+[eE]-?\d+))$/;
export var isIntRE   = /^-?(0|[1-9]\d*)$/;

export class ElementParser {
	static parseBool(v: string): boolean {
		if (v === 'false') {return false;}
		if (v === 'true') {return true;}
		return !!v;
	}
	static parseNumber(v: string): number {
		if (isFloatRE.test(v)) {return parseFloat(v);}
		if (isIntRE.test(v)) {return parseInt(v);}
		return NaN;
	}
	static str2html(s: string): string {
		return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
	}
	static html2str(s: string): string {
		return s.replace(/"/g,'&quot;').replace(/&lt;/g,'<').replace(/&amp;/g,'&');
	}
	static str2json(s: string): string {
		return s.replace(/"/g,'\\"')
	}
}

export function clearTextNodes(e: Node): Node {
	let c: Node = e.firstChild;
	let n: Node;
	while (c) {
		n = c.nextSibling;
		if (!(c instanceof HTMLElement)) {e.removeChild(c);}
		c = n;
	}
	return e;
}

export function nullO(debug?: boolean) {
	return Object.create(debug?{hasOwnPropery:Object.prototype.hasOwnProperty}:null);
}
