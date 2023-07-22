import { WorkspaceApi } from './api';
import { DesignerApi } from './api/designer-api';
import { ComponentContext } from './component-context';
import { Vector } from './core';
import { ComponentType, Sequence, Step } from './definition';
import { Badge, Component, Placeholder, PlaceholderDirection, SequenceComponent, StepComponentView } from './workspace';

export interface DesignerExtension {
	steps?: StepExtension[];
	stepComponentViewWrapper?: StepComponentViewWrapperExtension;
	badges?: BadgeExtension[];
	uiComponents?: UiComponentExtension[];
	draggedComponent?: DraggedComponentExtension;
	wheelController?: WheelControllerExtension;
	viewportController?: ViewportControllerExtension;
	placeholderController?: PlaceholderControllerExtension;
	placeholder?: PlaceholderExtension;
	grid?: GridExtension;
	rootComponent?: RootComponentExtension;
	sequenceComponent?: SequenceComponentExtension;
	daemons?: DaemonExtension[];
}

// StepExtension

export interface StepExtension<S extends Step = Step> {
	componentType: ComponentType;
	createComponentView(parentElement: SVGElement, stepContext: StepContext<S>, viewContext: StepComponentViewContext): StepComponentView;
}

export type StepComponentViewFactory = StepExtension['createComponentView'];

export interface StepComponentViewContext {
	getStepIconUrl(): string | null;
	createSequenceComponent(parentElement: SVGElement, sequence: Sequence): SequenceComponent;
	createPlaceholderForArea(
		parentElement: SVGElement,
		size: Vector,
		direction: PlaceholderDirection,
		sequence: Sequence,
		index: number
	): Placeholder;
}

export interface StepContext<S extends Step = Step> {
	parentSequence: Sequence;
	step: S;
	depth: number;
	position: number;
	isInputConnected: boolean;
	isOutputConnected: boolean;
}

export interface SequenceContext {
	sequence: Sequence;
	depth: number;
	isInputConnected: boolean;
	isOutputConnected: boolean;
}

export interface StepComponentViewWrapperExtension {
	wrap(view: StepComponentView, stepContext: StepContext): StepComponentView;
}

// BadgeExtension

export interface BadgeExtension {
	id: string;
	createForStep(parentElement: SVGElement, stepContext: StepContext, componentContext: ComponentContext): Badge;
	createForRoot?: (parentElement: SVGElement, componentContext: ComponentContext) => Badge;
	createStartValue(): unknown;
}

// WheelControllerExtension

export interface WheelControllerExtension {
	create(api: WorkspaceApi): WheelController;
}

export interface WheelController {
	onWheel(e: WheelEvent): void;
}

// UiComponentExtension

export interface UiComponentExtension {
	create(root: HTMLElement, api: DesignerApi): UiComponent;
}

export interface UiComponent {
	destroy(): void;
}

// DraggedComponentExtension

export interface DraggedComponentExtension {
	create(parentElement: HTMLElement, step: Step, componentContext: ComponentContext): DraggedComponent;
}

export interface DraggedComponent {
	width: number;
	height: number;
	destroy(): void;
}

// GridExtension

export interface GridExtension {
	create(): Grid;
}

export interface Grid {
	size: Vector;
	element: SVGElement;
	setScale(scale: number, scaledSize: Vector): void;
}

// RootComponentExtension

export interface RootComponentExtension {
	create(
		parentElement: SVGElement,
		sequence: Sequence,
		parentPlaceIndicator: SequencePlaceIndicator | null,
		context: ComponentContext
	): Component;
}

export interface SequencePlaceIndicator {
	sequence: Sequence;
	index: number;
}

// SequenceComponentExtension

export interface SequenceComponentExtension {
	create(parentElement: SVGElement, sequenceContext: SequenceContext, componentContext: ComponentContext): SequenceComponent;
}

// PlaceholderControllerExtension

export interface PlaceholderControllerExtension {
	create(): PlaceholderController;
}

export interface PlaceholderController {
	canCreate(sequence: Sequence, index: number): boolean;
}

// PlaceholderExtension

export interface PlaceholderExtension {
	gapSize: Vector;
	createForGap(parentElement: SVGElement, sequence: Sequence, index: number): Placeholder;
	createForArea(parentElement: SVGElement, size: Vector, direction: PlaceholderDirection, sequence: Sequence, index: number): Placeholder;
}

// ViewportControllerExtension

export interface ViewportControllerExtension {
	create(api: WorkspaceApi): ViewportController;
}

export interface ViewportController {
	setDefault(): void;
	zoom(direction: boolean): void;
	focusOnComponent(componentPosition: Vector, componentSize: Vector): void;
}

export interface Viewport {
	position: Vector;
	scale: number;
}

// DaemonExtension

export interface DaemonExtension {
	create(api: DesignerApi): Daemon;
}

export interface Daemon {
	destroy(): void;
}
