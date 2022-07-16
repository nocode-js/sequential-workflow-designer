import { ComponentType, Definition, Step } from './definition';

export interface DesignerConfiguration {
	theme?: string;
	isReadonly?: boolean;

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

export type StepEditorProvider = (step: Step) => HTMLElement;

export type GlobalEditorProvider = (definition: Definition) => HTMLElement;
