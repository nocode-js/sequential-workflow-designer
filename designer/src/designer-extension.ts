import { WorkspaceApi } from './api';
import { DesignerApi } from './api/designer-api';
import { ComponentContext } from './component-context';
import { Vector } from './core';
import { Branches, ComponentType, Sequence, Step } from './definition';
import { StepComponent, Component } from './workspace';

export interface DesignerExtension {
	steps?: StepExtension[];
	uiComponents?: UiComponentExtension[];
	draggedComponent?: DraggedComponentExtension;
	wheelController?: WheelControllerExtension;
	viewPortController?: ViewPortControllerExtension;
	placeholderController?: PlaceholderControllerExtension;
	rootComponent?: RootComponentExtension;
	daemons?: DaemonExtension[];
}

// StepExtension

export interface StepExtension<S extends Step = Step> {
	componentType: ComponentType;
	createComponent(parentElement: SVGElement, stepContext: StepContext<S>, componentContext: ComponentContext): StepComponent;
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

// ViewPortControllerExtension

export interface ViewPortControllerExtension {
	create(api: WorkspaceApi): ViewPortController;
}

export interface ViewPortController {
	setDefault(): void;
	zoom(direction: boolean): void;
	focusOnComponent(componentPosition: Vector, componentSize: Vector): void;
}

export interface ViewPort {
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
