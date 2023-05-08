import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';
import { CustomAction } from '../designer-configuration';
import { StepComponent } from './step-component';

export interface Component {
	view: ComponentView;

	findById(stepId: string): StepComponent | null;
	resolveClick(click: ClickDetails): ClickCommand | null;
	getPlaceholders(result: Placeholder[]): void;
	setIsDragging(isDragging: boolean): void;
	updateBadges(result: BadgesResult): void;
}

export interface ComponentView {
	g: SVGGElement;
	width: number;
	height: number;
	joinX: number;
}

export interface StepComponentView extends ComponentView {
	sequenceComponents: SequenceComponent[] | null;
	placeholders: Placeholder[] | null;

	hasOutput(): boolean;
	/**
	 * @param click Details about the click.
	 * @returns `true` if selected a step, a click command if clicked a specific action, `null` if not clicked at this view.
	 */
	resolveClick(click: ClickDetails): true | ClickCommand | null;
	setIsDragging(isDragging: boolean): void;
	setIsSelected(isSelected: boolean): void;
	setIsDisabled(isDisabled: boolean): void;
	getClientPosition(): Vector;
}

export interface SequenceComponent extends Component {
	hasOutput: boolean;
}

// Click

export interface ClickDetails {
	element: Element;
	position: Vector;
	scale: number;
}

export type ClickCommand = SelectStepClickCommand | RerenderStepClickCommand | OpenFolderClickCommand | TriggerCustomActionClickCommand;

export interface BaseClickCommand {
	type: ClickCommandType;
}

export interface SelectStepClickCommand extends BaseClickCommand {
	type: ClickCommandType.selectStep;
	component: StepComponent;
}

export interface RerenderStepClickCommand extends BaseClickCommand {
	type: ClickCommandType.rerenderStep;
	step: Step;
}

export interface OpenFolderClickCommand extends BaseClickCommand {
	type: ClickCommandType.openFolder;
	step: Step;
}

export interface TriggerCustomActionClickCommand extends BaseClickCommand {
	type: ClickCommandType.triggerCustomAction;
	step: Step | null;
	sequence: Sequence;
	action: CustomAction;
}

export enum ClickCommandType {
	selectStep = 1,
	rerenderStep = 2,
	openFolder = 3,
	triggerCustomAction = 4
}

// Badges

export interface BadgeView {
	g: SVGGElement;
	width: number;
	height: number;
}

export interface Badge {
	view: BadgeView | null;
	update(result: unknown): unknown;
	resolveClick(click: ClickDetails): ClickCommand | null;
}

export type BadgesResult = unknown[];

// Placeholder

export interface Placeholder {
	view: PlaceholderView;
	parentSequence: Sequence;
	index: number;

	getClientRect(): DOMRect;
	setIsHover(isHover: boolean): void;
	setIsVisible(isVisible: boolean): void;
	resolveClick(click: ClickDetails): ClickCommand | null;
}

export enum PlaceholderDirection {
	none = 0,
	in = 1,
	out = 2
}

export interface PlaceholderView {
	g: SVGGElement;
}
