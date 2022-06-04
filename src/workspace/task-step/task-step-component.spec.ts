import { Dom } from '../../core/dom';
import { ComponentType, Sequence, TaskStep } from '../../definition';
import { TaskStepComponent } from './task-step-component';

describe('TaskStepComponent', () => {
	it('create() creates component', () => {
		const step: TaskStep = {
			id: '0x0',
			componentType: ComponentType.task,
			name: 'Foo',
			properties: {},
			type: 'foo'
		};
		const parentSequence: Sequence = [step];

		const parent = Dom.svg('svg');
		const component = TaskStepComponent.create(parent, step, parentSequence, {});

		expect(component).toBeDefined();
	});
});
