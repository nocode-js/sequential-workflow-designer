
export interface Definition {
	sequence: Sequence;
	properties: Properties;
}

export type Sequence = Step[];

export interface Step {
	id: string;
	componentType: ComponentType;
	type: string;
	name: string;
	properties: Properties;
}

export enum ComponentType {
	task = 'task',
	switch = 'switch',
	container = 'container'
}

export interface TaskStep extends Step {
	componentType: ComponentType.task;
}

export interface SwitchStep extends Step {
	componentType: ComponentType.switch;
	branches: Branches;
}

export interface ContainerStep extends Step {
	componentType: ComponentType.container;
	sequence: Sequence;
}

export interface Branches {
	[branchName: string]: Sequence;
}

export interface Properties {
	[name: string]: string | number;
}
