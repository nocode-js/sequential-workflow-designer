
export interface Workflow {
	sequence: Sequence;
	properties?: Properties;
}

export interface Sequence {
	steps: Step[];
}

export interface Step {
	type: StepType;
	name: string;
	properties?: Properties;
}

export enum StepType {
	task,
	switch
}

export interface TaskStep extends Step {
	type: StepType.task;
}

export interface SwitchStep extends Step {
	type: StepType.switch;
	branches: Branches;
}

export interface Branches {
	[branchName: string]: Sequence;
}

export interface Properties {
	[name: string]: string | number;
}
