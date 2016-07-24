/// <reference path="../typings/index.d.ts" />

import {NodeHash} from './NodeHash';
import {NodeFactory} from './NodeFactory';

export class NodeEngine implements iNodeEngine {
	protected hash: iElementRegistry<iProtoBase>;
	protected factory: iNodeFactory;
	protected root: iValue;
	constructor(hash: iElementRegistry<iProtoBase>, factory: iNodeFactory) {
		this.hash = hash;
		this.factory = factory;
		this.root = null;
	}
	createValue(input: HTMLElement|ValueType): iValue {
		let v = this.factory.create(this.hash,input);
		if (!this.root) {this.root = v;}
		return v;
	}
	getNode(e: HTMLElement): iProtoBase {
		return this.hash.get(e);
	}
	empty() {
		this.root && this.root.remove(true);
		this.root = null;
	}
}
