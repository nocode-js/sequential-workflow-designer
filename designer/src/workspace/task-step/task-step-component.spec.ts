import { Dom } from '../../core/dom';
import { TaskStep } from '../../definition';
import { StepContext } from '../../designer-extension';
import { createComponentContextStub } from '../../test-tools/stubs';
import { TaskStepComponent } from './task-step-component';

describe('TaskStepComponent', () => {
	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const step: TaskStep = {
			id: '0x0',
			componentType: 'task',
			name: 'Foo',
			properties: {},
			type: 'foo'
		};
		const stepContext: StepContext<TaskStep> = {
			depth: 0,
			position: 0,
			isInputConnected: true,
			isOutputConnected: true,
			parentSequence: [step],
			step
		};
		const componentContext = createComponentContextStub();
		const component = TaskStepComponent.create(parent, stepContext, componentContext);

		expect(component).toBeDefined();
	});
});
