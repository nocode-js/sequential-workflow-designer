import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';

export interface Component {
	view: ComponentView;

	findStepComponent(element: Element): StepComponent | null;
	getPlaceholders(result: Placeholder[]): void;
	setDropMode(isEnabled: boolean): void;
}

export interface ComponentView {
	g: SVGGElement;
	width: number;
	height: number;
	joinX: number;

	getPosition(): Vector;
}

export interface Placeholder {
	element: Element;
	append(step: Step): void;
	setIsHover(isHover: boolean): void;
}

export interface StepComponent extends Component {
	step: Step;
	parentSequence: Sequence;
	canDrag: boolean;
	setState(state: StepComponentState): void;
}

export enum StepComponentState {
	default,
	selected,
	moving
}
