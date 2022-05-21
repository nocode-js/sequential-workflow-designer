import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';

export interface Component {
	view: ComponentView;

	findStepComponent(element: Element): StepComponent | null;
	findPlaceholder(element: Element): Placeholder | null;
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
	append(step: Step): void;
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
