///<reference path="./NodeEngineUtils.d.ts" />

declare type ValueType = 'u' | 's' | 'b' | 'n' | 'a' | 'o';
declare type ValueContent = string | number | boolean;
interface ProtoBase {
	e: HTMLElement;
	id: number;
	getNodeId(): number;
	_remove(unlink: boolean): any;
}
interface Value extends ProtoBase {
	type: ValueType;
	value: ValueContent;
	isEmpty(): boolean;
	isEditable(): boolean;
	isComplex(): boolean;
	getValue(): ValueContent;
	getDisplayValue(): string;
	setValue(input: ValueContent): any;
	resetValue(): HTMLElement;
	toString(): string;
}
interface ComplexValue extends Value {
	s: number;
	empty(): any;
}
interface ArrayValue extends ComplexValue {
	items: Item[];
	getItem(index: number): ValueContainer;
	getItemValue(index: number): Value;
	addItem(type: ValueType, offset?: number): Value;
	addItems(amount: number, type: ValueType, offset?: number): Value[];
	removeItem(index: number): any;
}
interface ObjectValue extends ComplexValue {
	members: {
			[name: string]: Member;
	};
	getMember(name: string): Member;
	getMemberValue(name: string): Value;
	getMemberNames(): string[];
	addMember(name: string, type: ValueType): Value;
	removeMember(name: string): any;
	renameMember(oldName: string, newName: string): any;
}
interface ValueContainer extends ProtoBase {
	getParent(): Value;
	getType(): ValueType;
	setType(type: ValueType): Value;
}
interface Item extends ValueContainer {
	v: any;
	getIndex(): number;
}
interface Member extends ValueContainer {
	n: MemberName;
	v: Value;
	getName(): string;
	setName(name: string): any;
}
interface MemberName extends ProtoBase {
	name: string;
	setName(name: string): any;
}
