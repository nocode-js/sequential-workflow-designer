import { Step } from '../definition';
import { createDesignerContextStub, createStepStub } from '../test-tools/stubs';
import { StepComponent } from '../workspace/component';
import { SelectStepBehavior } from './select-step-behavior';

describe('SelectStepBehavior', () => {

	it('when a user did not move a mouse, then the behavior selects the step', () => {
		let selectedStep: Step | null = null;

		const step = createStepStub();
		const stepComponent = jasmine.createSpyObj<StepComponent>('StepComponent', ['setState'], { step });
		const context = createDesignerContextStub();
		context.onSelectedStepChanged.subscribe(s => selectedStep = s);

		const behavior = SelectStepBehavior.create(stepComponent, context);

		behavior.onStart();
		behavior.onEnd();

		expect<Step | null>(selectedStep).toEqual(step);
	});
});
