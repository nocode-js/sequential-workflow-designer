import { Vector } from '../core/vector';
import { Sequence } from '../definition';
import { SequenceComponent } from './sequence';
import { StepComponent } from './step-component';

export interface Component {
	view: ComponentView;

	findById(stepId: string): StepComponent | null;
	resolveClick(click: ClickDetails): ResolvedClick | null;
	getPlaceholders(result: Placeholder[]): void;
	setIsDragging(isDragging: boolean): void;
	updateBadges(result: BadgesResult): void;
}

export interface ClickDetails {
	element: Element;
	position: Vector;
	scale: number;
}

export interface ResolvedClick {
	component: StepComponent;
	command: ClickCommand;
}

export interface ClickCommand {
	type: ClickCommandType;
}

export interface TriggerCustomActionClickCommand extends ClickCommand {
	type: ClickCommandType.triggerCustomAction;
	action: string;
}

export enum ClickCommandType {
	selectStep = 1,
	openFolder = 2,
	triggerCustomAction = 3
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
	resolveClick(click: ClickDetails): ClickCommand | null;
	setIsDragging(isDragging: boolean): void;
	setIsSelected(isSelected: boolean): void;
	setIsDisabled(isDisabled: boolean): void;
	getClientPosition(): Vector;
}

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

export interface Placeholder {
	parentSequence: Sequence;
	index: number;

	getClientRect(): DOMRect;
	setIsHover(isHover: boolean): void;
}
