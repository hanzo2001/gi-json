///<reference path="./NodeEngine.d.ts" />
///<reference path="./NodeHash.d.ts" />
///<reference path="./TreeForms.d.ts" />

interface TreeState {
	engine: (hash: NodeHash, input: HTMLElement|ValueType) => Value;
	hash: NodeHash;
	formBase: HTMLElement;
	treeBase: HTMLElement;
	rootElement: HTMLElement;
	rootValue: Value;
	controlForm: TreeForm;
	clickEventsAllowed: boolean;
	factory(input: HTMLElement|ValueType): Value;
	blockClicks();
	allowClicks();
}
