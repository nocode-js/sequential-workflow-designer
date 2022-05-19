
export interface Component {
	g: SVGGElement;
	width: number;
	height: number;
	joinX: number;

	findComponent(element: SVGElement): StepComponent | null;
	setDropMode(isEnabled: boolean): void;
}

export enum StepComponentState {
	default,
	selected,
	moving
}

export interface StepComponent extends Component {
	canDrag: boolean;

	setState(state: StepComponentState): void;
}
