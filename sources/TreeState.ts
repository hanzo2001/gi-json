///<reference path="./typings/TreeState.d.ts" />

export class TreeState implements TreeState {
	engine: (hash: NodeHash, input: HTMLElement|ValueType) => Value;
	hash: NodeHash;
	formBase: HTMLElement;
	treeBase: HTMLElement;
	rootElement: HTMLElement;
	rootValue: Value;
	controlForm: TreeForm;
	clickEventsAllowed: boolean;
	constructor(h: NodeHash, engine) {
		this.hash = h;
		this.engine = engine;
	}
	factory(input: HTMLElement|ValueType): Value {
		return this.engine(this.hash,input);
	}
	blockClicks() {
		this.clickEventsAllowed = false;
	}
	allowClicks() {
		this.clickEventsAllowed = true;
	}
}
