///<reference path="./NodeEngine.d.ts" />

interface NodeHash {
	isRegistered(e: HTMLElement): boolean;
	getNode(e: HTMLElement): ProtoBase;
	register(value: ProtoBase): number;
	unregister(e: HTMLElement): HTMLElement;
}
