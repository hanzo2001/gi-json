///<reference path="../typings/index.d.ts" />

var no = function(): Object {return Object.create(null);}
var ex = function(b: Object, o: Object): any {for (let i in o) {b[i]=o[i];} return b;}

export var primitiveTypes: PrimitiveValueTypeNames = ex(no(),{
	u: 'null',
	s: 'string',
	b: 'bool',
	n: 'number',
});

export var complexTypes: ComplexValueTypeNames = ex(no(),{
	a: 'array',
	o: 'object'
});

export var valueTypes: ValueTypeNames = ex(ex(no(),primitiveTypes),complexTypes);

no = ex = null;
