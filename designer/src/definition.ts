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

export type ComponentType = 'task' | 'switch' | 'container' | string;

export interface TaskStep extends Step {
	componentType: 'task';
}

export interface SwitchStep extends Step {
	componentType: 'switch';
	branches: Branches;
}

export interface ContainerStep extends Step {
	componentType: 'container';
	sequence: Sequence;
}

export interface Branches {
	[branchName: string]: Sequence;
}

export interface Properties {
	[name: string]: string | number;
}
