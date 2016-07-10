///<reference path="./typings/NodeEngineUtils.d.ts" />

export var isFloatRE = /^(\+|-)?\d*[\.eE](\+|-)?\d+$/;
export var isIntRE   = /^(\+|-)?\d+$/;

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
}

export function clearTextNodes(e: Node) {
	let c: Node = e.firstChild;
	let n: Node;
	while (c) {
		n = c.nextSibling;
		if (!(c instanceof HTMLElement)) {e.removeChild(c);}
		c = n;
	}
}

export function nullO(debug?: boolean) {
	return Object.create(debug?{hasOwnPropery:Object.prototype.hasOwnProperty}:null);
}
