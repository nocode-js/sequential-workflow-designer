import { ComponentType, Sequence, TaskStep } from '../definition';
import { TaskStepComponent } from './task-step-component';

describe('TaskStepComponent', () => {

	it('creates component', () => {
		const step: TaskStep = {
			id: '0x0',
			componentType: ComponentType.task,
			name: 'Foo',
			properties: {},
			type: 'foo'
		};
		const parentSequence: Sequence = {
			steps: [step]
		};

		const component = TaskStepComponent.create(step, parentSequence, {});

		expect(component).toBeDefined();
	});
});
