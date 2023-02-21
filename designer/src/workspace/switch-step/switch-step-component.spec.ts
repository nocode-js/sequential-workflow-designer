import { Dom } from '../../core/dom';
import { Sequence, SwitchStep } from '../../definition';
import { StepContext } from '../../designer-extension';
import { createComponentContextStub, createStepStub } from '../../test-tools/stubs';
import { SwitchStepComponent } from './switch-step-component';

describe('SwitchStepComponent', () => {
	it('creates component', () => {
		const step: SwitchStep = {
			id: '0x0',
			componentType: 'switch',
			name: 'Foo',
			properties: {},
			branches: {
				true: [createStepStub()],
				false: [createStepStub()]
			},
			type: 'foo'
		};
		const parentSequence: Sequence = [step];
		const stepContext: StepContext<SwitchStep> = {
			depth: 0,
			position: 0,
			isInputConnected: true,
			isOutputConnected: false,
			parentSequence: parentSequence,
			step
		};

		const parent = Dom.svg('svg');
		const componentContext = createComponentContextStub();
		const component = SwitchStepComponent.create(parent, stepContext, componentContext);

		expect(component).toBeDefined();
	});
});
