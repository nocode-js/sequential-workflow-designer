import { WorkspaceApi } from './api';
import { DesignerApi } from './api/designer-api';
import { ComponentContext } from './component-context';
import { Vector } from './core';
import { Branches, ComponentType, Sequence, Step } from './definition';
import { Badge, Component, StepComponentView } from './workspace';

export interface DesignerExtension {
	steps?: StepExtension[];
	badges?: BadgeExtension[];
	uiComponents?: UiComponentExtension[];
	draggedComponent?: DraggedComponentExtension;
	wheelController?: WheelControllerExtension;
	viewportController?: ViewportControllerExtension;
	placeholderController?: PlaceholderControllerExtension;
	rootComponent?: RootComponentExtension;
	daemons?: DaemonExtension[];
}

// StepExtension

export interface StepExtension<S extends Step = Step> {
	componentType: ComponentType;
	createComponentView(parentElement: SVGElement, stepContext: StepContext<S>, componentContext: ComponentContext): StepComponentView;
	getChildren(step: S): StepChildren | null;
}

export interface StepContext<S extends Step = Step> {
	parentSequence: Sequence;
	step: S;
	depth: number;
	position: number;
	isInputConnected: boolean;
	isOutputConnected: boolean;
}

export interface StepChildren {
	type: StepChildrenType;
	sequences: Sequence | Branches;
}

export enum StepChildrenType {
	singleSequence = 1,
	branches = 2
}

// BadgeExtension

export interface BadgeExtension {
	createBadge(parentElement: SVGElement, stepContext: StepContext, componentContext: ComponentContext): Badge;
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
	create(parent: HTMLElement, step: Step, componentContext: ComponentContext): DraggedComponent;
}

export interface DraggedComponent {
	width: number;
	height: number;
	destroy(): void;
}

// RootComponentExtension

export interface RootComponentExtension {
	create(
		parentElement: SVGElement,
		sequence: Sequence,
		parentSequencePlaceIndicator: SequencePlaceIndicator | null,
		context: ComponentContext
	): Component;
}

export interface SequencePlaceIndicator {
	sequence: Sequence;
	index: number;
}

// PlaceholderControllerExtension

export interface PlaceholderControllerExtension {
	create(): PlaceholderController;
}

export interface PlaceholderController {
	canCreate(sequence: Sequence, index: number): boolean;
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

// Daemon

export interface DaemonExtension {
	create(api: DesignerApi): Daemon;
}

export interface Daemon {
	destroy(): void;
}
