import { DesignerApi } from './api/designer-api';
import { ComponentContext } from './component-context';
import { Branches, ComponentType, Sequence, Step } from './definition';
import { StepComponent, Component } from './workspace';

export interface DesignerExtension {
	steps?: StepExtension[];
	uiComponents?: UiComponentExtension[];
	wheelController?: WheelControllerExtension;
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
	create(api: DesignerApi): WheelController;
}

export interface WheelController {
	onWheel(e: WheelEvent): void;
	destroy(): void;
}

// UiComponentExtension

export interface UiComponentExtension {
	create(root: HTMLElement, api: DesignerApi): UiComponent;
}

export interface UiComponent {
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

// PlaceholderController

export interface PlaceholderControllerExtension {
	create(): PlaceholderController;
}

export interface PlaceholderController {
	canCreate(sequence: Sequence, index: number): boolean;
}

// Daemon

export interface DaemonExtension {
	create(api: DesignerApi): Daemon;
}

export interface Daemon {
	destroy(): void;
}
