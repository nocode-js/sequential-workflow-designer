import { Definition, Step, StepType } from './definition';

export interface DesignerConfiguration {

	toolboxSteps: Step[];

	stepIconUrlProvider?: (type: StepType, internalType: string) => string | null;
	stepValidator?: (step: Step) => boolean;

	stepEditorProvider: (step: Step) => HTMLElement;
	globalEditorProvider: (definition: Definition) => HTMLElement;
}
