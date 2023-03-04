import { Uid } from 'sequential-workflow-designer';
import { SwitchStep, TaskStep } from './model';

export function createTaskStep(): TaskStep {
	return {
		id: Uid.next(),
		componentType: 'task',
		type: 'task',
		name: 'test',
		properties: {}
	};
}

export function createSwitchStep(): SwitchStep {
	return {
		id: Uid.next(),
		componentType: 'switch',
		type: 'switch',
		name: 'switch',
		properties: {},
		branches: {
			true: [],
			false: []
		}
	};
}
