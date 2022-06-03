import { ComponentType, Step } from '../definition';
import { createDesignerContextFake } from '../designer-context-faker';
import { StepComponent } from '../workspace/component';
import { SelectStepBehavior } from './select-step-behavior';

describe('SelectStepBehavior', () => {

	it('when a user did not move a mouse, then the behavior selects the step', () => {
		let selectedStep: Step | null = null;

		const step: Step = {
			id: '0x0',
			componentType: ComponentType.task,
			name: 'x',
			properties: {},
			type: 'x'
		};

		const stepComponent = jasmine.createSpyObj<StepComponent>('StepComponent', ['setState'], { step });

		const context = createDesignerContextFake();
		context.onSelectedStepChanged.subscribe(s => selectedStep = s);

		const behavior = SelectStepBehavior.create(stepComponent, context);

		behavior.onStart();
		behavior.onEnd();

		expect<Step | null>(selectedStep).toEqual(step);
	});
});
