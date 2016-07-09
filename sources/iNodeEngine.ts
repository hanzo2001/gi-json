type ValueType = 'u' | 's' | 'b' | 'n' | 'a' | 'o';
type ValueContent = string | number | boolean;

interface iNodeHash {
	isRegistered(e: HTMLElement): boolean;
	getNode(e: HTMLElement): iProtoBase;
	register(value: iProtoBase): number;
	unregister(e: HTMLElement): HTMLElement;
}
interface iProtoBase {
	e: HTMLElement;
	id: number;
	getNodeId(): number;
	_remove(unlink: boolean);
}
interface iValue extends iProtoBase {
	type: ValueType;
	value: ValueContent;
	isEmpty(): boolean;
	isEditable(): boolean;
	isComplex(): boolean;
	getValue(): ValueContent;
	getDisplayValue(): string;
	setValue(input: ValueContent);
	resetValue(): HTMLElement;
	toString(): string;
}
interface iComplexValue extends iValue {
	s: number;
	empty();
}
interface iArrayValue extends iComplexValue {
	items: iItem[];
	getItem(index: number): iValueContainer;
	getItemValue(index: number): iValue;
	addItem(type: ValueType, offset?: number): iValue;
	addItems(amount: number, type: ValueType, offset?: number): iValue[];
	removeItem(index: number);
}
interface iObjectValue extends iComplexValue {
	members: {[name:string]: iMember};
	getMember(name: string): iMember;
	getMemberValue(name: string): iValue;
	getMemberNames(): string[];
	addMember(name: string, type: ValueType): iValue;
	removeMember(name: string);
	renameMember(oldName: string, newName: string);
}
interface iValueContainer extends iProtoBase {
	getParent(): iValue;
	getType(): ValueType;
	setType(type: ValueType): iValue;
}
interface iItem extends iValueContainer {
	v;
	getIndex(): number;
}
interface iMember extends iValueContainer {
	n: iMemberName;
	v: iValue;
	getName(): string;
	setName(name: string);
}
interface iMemberName extends iProtoBase {
	name: string;
	setName(name: string);	
}
