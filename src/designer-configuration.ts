import { ComponentType, Definition, Step } from './definition';

export interface DesignerConfiguration {
	toolbox: ToolboxConfiguration;
	steps: StepsConfiguration;
	editors: EditorsConfiguration;
}

export interface ToolboxConfiguration {
	isHidden?: boolean;
	groups: ToolboxGroupConfiguration[];
}

export interface StepsConfiguration {
	iconUrlProvider?: (componentType: ComponentType, type: string) => string | null;
	validator?: (step: Step) => boolean;
}

export interface EditorsConfiguration {
	stepEditorProvider: (step: Step) => HTMLElement;
	globalEditorProvider: (definition: Definition) => HTMLElement;
}

export interface ToolboxGroupConfiguration {
	name: string;
	steps: Step[];
}
