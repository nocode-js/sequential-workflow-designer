import { Step, BranchedStep, Definition } from 'sequential-workflow-designer';

export interface WorkflowDefinition extends Definition {
	properties: {
		alfa?: string;
	};
}

export interface TaskStep extends Step {
	componentType: 'task';
	type: 'task';
	properties: {
		x?: string;
		y?: string;
	};
}

export interface SwitchStep extends BranchedStep {
	type: 'switch';
	name: 'switch';
	properties: {
		x?: string;
		y?: string;
	};
}
