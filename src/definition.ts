
export interface Sequence {
	steps: Step[];
}

export interface Branches {
	[branchName: string]: Sequence;
}

export interface Step {
	type: StepType;
	name: string;
	properties?: StepProperties;
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

export interface StepProperties {
	[name: string]: string | number;
}
