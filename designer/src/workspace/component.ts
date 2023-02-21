import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';

export interface Component {
	view: ComponentView;

	findById(stepId: string): StepComponent | null;
	findByClick(click: ClickDetails): ClickResult | null;
	getPlaceholders(result: Placeholder[]): void;
	setIsDragging(isDragging: boolean): void;
	validate(): boolean;
}

export interface ClickDetails {
	element: Element;
	position: Vector;
	scale: number;
}

export interface ClickResult {
	component: StepComponent;
	action: ClickBehavior;
}

export interface ClickBehavior {
	type: ClickBehaviorType;
	argument?: string;
}

export enum ClickBehaviorType {
	selectStep = 1,
	openFolder = 2
}

export interface ComponentView {
	g: SVGGElement;
	width: number;
	height: number;
	joinX: number;

	getClientPosition(): Vector;
}

export interface Placeholder {
	parentSequence: Sequence;
	index: number;

	getRect(): DOMRect;
	setIsHover(isHover: boolean): void;
}

export interface StepComponent extends Component {
	step: Step;
	parentSequence: Sequence;
	hasOutput: boolean;

	setIsSelected(isSelected: boolean): void;
	setIsDisabled(isDisabled: boolean): void;
}
