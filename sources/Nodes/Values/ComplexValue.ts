/// <reference path="../../typings/index.d.ts" />
/// <reference path="../../typings/index.d.ts" />

import {Value} from "./Value";

export abstract class ComplexValue extends Value implements iComplexValue {
	s: number;
	f: iNodeFactory;
	isComplex(): boolean {
		return true;
	}
	first(): iValueContainer {
		return null;
	}
	last(): iValueContainer {
		return null;
	}
	empty() {}
}
