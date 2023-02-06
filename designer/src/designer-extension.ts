import { Vector } from './core';
import { Branches, ComponentType, Sequence, Step } from './definition';
import { DesignerContext } from './designer-context';
import { ComponentContext, StepComponent } from './workspace';

export interface DesignerExtension {
	steps?: StepExtension[];
	uiComponents?: UiComponentExtension[];
	wheelController?: WheelControllerExtension;
}

// StepExtension

export interface StepExtension<S extends Step = Step> {
	componentType: ComponentType;
	createComponent(parentElement: SVGElement, step: S, parentSequence: Sequence, componentContext: ComponentContext): StepComponent;
	getChildren(step: S): StepChildren | null;
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
	create(designerContext: DesignerContext, positionSource: WorkspaceClientPositionSource): WheelController;
}

export interface WorkspaceClientPositionSource {
	getClientPosition(): Vector;
}

export interface WheelController {
	onWheel(e: WheelEvent): void;
	destroy(): void;
}

// UiComponentExtension

export interface UiComponentExtension {
	create(parent: HTMLElement, designerContext: DesignerContext): UiComponent;
}

export interface UiComponent {
	destroy(): void;
}
