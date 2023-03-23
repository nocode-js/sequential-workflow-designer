import { createDesignerContextStub, createStepStub } from '../test-tools/stubs';
import { StepComponent } from '../workspace/step-component';
import { SelectStepBehavior } from './select-step-behavior';

describe('SelectStepBehavior', () => {
	it('when a user did not move a mouse, then the behavior selects the step', () => {
		let selectedStepId: string | null = null;

		const step = createStepStub();
		const stepComponent = jasmine.createSpyObj<StepComponent>('StepComponent', ['setIsDisabled'], {
			step
		});
		const designerContext = createDesignerContextStub();
		designerContext.state.onSelectedStepIdChanged.subscribe(s => (selectedStepId = s));

		const behavior = SelectStepBehavior.create(stepComponent, false, designerContext);

		behavior.onStart();
		behavior.onEnd(false);

		expect<string | null>(selectedStepId).toEqual(step.id);
	});
});
