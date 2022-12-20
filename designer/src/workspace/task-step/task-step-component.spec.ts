import { Dom } from '../../core/dom';
import { Sequence, TaskStep } from '../../definition';
import { createComponentContextStub } from '../../test-tools/stubs';
import { TaskStepComponent } from './task-step-component';

describe('TaskStepComponent', () => {
	it('create() creates component', () => {
		const step: TaskStep = {
			id: '0x0',
			componentType: 'task',
			name: 'Foo',
			properties: {},
			type: 'foo'
		};
		const parentSequence: Sequence = [step];

		const parent = Dom.svg('svg');
		const context = createComponentContextStub();
		const component = TaskStepComponent.create(parent, step, parentSequence, context);

		expect(component).toBeDefined();
	});
});
