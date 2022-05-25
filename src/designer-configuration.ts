import { Definition, Step, StepType } from './definition';

export interface DesignerConfiguration {

	toolboxGroups: ToolboxGroupConfiguration[];

	stepIconUrlProvider?: (type: StepType, internalType: string) => string | null;
	stepValidator?: (step: Step) => boolean;

	stepEditorProvider: (step: Step) => HTMLElement;
	globalEditorProvider: (definition: Definition) => HTMLElement;
}

export interface ToolboxGroupConfiguration {
	name: string;
	steps: Step[];
}
