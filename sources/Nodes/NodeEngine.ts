/// <reference path="../typings/index.d.ts" />

import   {NullValue} from './Values/NullValue';
import {StringValue} from './Values/StringValue';
import   {BoolValue} from './Values/BoolValue';
import {NumberValue} from './Values/NumberValue';
import  {ArrayValue} from './Values/ArrayValue';
import {ObjectValue} from './Values/ObjectValue';

export class NodeEngine implements iNodeEngine {
	hash: iNodeHash;
	constructor(hash: iNodeHash) {
		this.hash = hash;
	}
	createValue(input: HTMLElement|ValueType): iValue {
		let e: HTMLElement = null;
		let type: ValueType;
		let o: iValue;
		if (input instanceof HTMLElement) {
			e = input;
			type = <ValueType>e.dataset['t'];
		} else {
			type = input;
			if (!type) {type = 'u';}
		}
		switch (type) {
			case 'u': o = new   NullValue(this.hash,e); break;
			case 's': o = new StringValue(this.hash,e); break;
			case 'b': o = new   BoolValue(this.hash,e); break;
			case 'n': o = new NumberValue(this.hash,e); break;
			case 'a': o = new  ArrayValue(this.hash,e,this); break;
			case 'o': o = new ObjectValue(this.hash,e,this); break;
		}
		return o;
	}
}
