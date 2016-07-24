/// <reference path="../typings/iIdGeneratorFactory.d.ts" />

export class IdGeneratorFactory implements iIdGeneratorFactory {
	create(): ()=>number {
		let id = 0;
		return function():number{return ++id;};
	}
}
