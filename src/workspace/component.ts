import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';

export interface Component {
	view: ComponentView;

	findStepComponent(element: Element): StepComponent | null;
	getPlaceholders(result: Placeholder[]): void;
	setIsMoving(isMoving: boolean): void;
	validate(): boolean;
}

export interface ComponentView {
	g: SVGGElement;
	width: number;
	height: number;
	joinX: number;

	getClientPosition(): Vector;
}

export interface Placeholder {
	element: Element;
	parentSequence: Sequence;
	index: number;

	setIsHover(isHover: boolean): void;
}

export interface StepComponent extends Component {
	step: Step;
	parentSequence: Sequence;

	setState(state: StepComponentState): void;
}

export enum StepComponentState {
	default,
	selected,
	moving
}
