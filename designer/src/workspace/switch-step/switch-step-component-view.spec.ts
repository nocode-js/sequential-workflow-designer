import { Dom } from '../../core/dom';
import { BranchedStep } from '../../definition';
import { StepContext } from '../../designer-extension';
import { createComponentContextStub } from '../../test-tools/stubs';
import { SwitchStepComponentView } from './switch-step-component-view';

describe('SwitchStepComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');

		const step: BranchedStep = {
			id: '0x',
			branches: {
				x: [],
				y: []
			},
			componentType: 'switch',
			name: 'x',
			properties: {},
			type: 'test'
		};
		const stepContext: StepContext<BranchedStep> = {
			depth: 0,
			position: 0,
			isInputConnected: true,
			isOutputConnected: true,
			parentSequence: [],
			step
		};
		const componentContext = createComponentContextStub();

		SwitchStepComponentView.create(parent, stepContext, componentContext, {
			minContainerWidth: 40,
			paddingX: 20,
			paddingTop: 20,
			connectionHeight: 16,
			inputSize: 18,
			inputIconSize: 14,
			labelHeight: 22,
			labelPaddingX: 10,
			labelMinWidth: 50,
			labelRadius: 10
		});
		expect(parent.children.length).not.toEqual(0);
	});
});
