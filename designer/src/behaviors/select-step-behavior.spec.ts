import { Step } from '../definition';
import { createComponentContextStub, createDesignerContextStub, createStepStub } from '../test-tools/stubs';
import { StepComponent } from '../workspace/component';
import { SelectStepBehavior } from './select-step-behavior';

describe('SelectStepBehavior', () => {
	it('when a user did not move a mouse, then the behavior selects the step', () => {
		let selectedStep: Step | null = null;

		const step = createStepStub();
		const stepComponent = jasmine.createSpyObj<StepComponent>('StepComponent', ['setState'], {
			step
		});
		const designerContext = createDesignerContextStub();
		const componentContext = createComponentContextStub();
		designerContext.state.onSelectedStepChanged.subscribe(s => (selectedStep = s));

		const behavior = SelectStepBehavior.create(stepComponent, designerContext, componentContext);

		behavior.onStart();
		behavior.onEnd(false);

		expect<Step | null>(selectedStep).toEqual(step);
	});
});
