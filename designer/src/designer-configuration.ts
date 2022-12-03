import { ComponentType, Definition, Sequence, Step } from './definition';

export interface DesignerConfiguration {
	theme?: string;
	isReadonly?: boolean;
	undoStackSize?: number;

	toolbox: ToolboxConfiguration;
	steps: StepsConfiguration;
	editors: EditorsConfiguration;
}

export interface ToolboxConfiguration {
	isHidden?: boolean;
	groups: ToolboxGroupConfiguration[];
}

export type StepDefinition = Omit<Step, 'id'>;

export interface ToolboxGroupConfiguration {
	name: string;
	steps: StepDefinition[];
}

export interface StepsConfiguration {
	canInsertStep?: (step: Step, targetSequence: Sequence, targetIndex: number) => boolean;
	canMoveStep?: (sourceSequence: Sequence, step: Step, targetSequence: Sequence, targetIndex: number) => boolean;
	canDeleteStep?: (step: Step, parentSequence: Sequence) => boolean;

	iconUrlProvider?: StepIconUrlProvider;
	validator?: StepValidator;
}

export type StepIconUrlProvider = (componentType: ComponentType, type: string) => string | null;

export type StepValidator = (step: Step) => boolean;

export interface EditorsConfiguration {
	isHidden?: boolean;
	stepEditorProvider: StepEditorProvider;
	globalEditorProvider: GlobalEditorProvider;
}

export interface StepEditorContext {
	notifyNameChanged(): void;
	notifyPropertiesChanged(): void;
	notifyChildrenChanged(): void;
}

export type StepEditorProvider = (step: Step, context: StepEditorContext) => HTMLElement;

export interface GlobalEditorContext {
	notifyPropertiesChanged(): void;
}

export type GlobalEditorProvider = (definition: Definition, context: GlobalEditorContext) => HTMLElement;
