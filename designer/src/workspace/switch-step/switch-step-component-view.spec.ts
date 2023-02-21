import { Dom } from '../../core/dom';
import { SwitchStep } from '../../definition';
import { StepContext } from '../../designer-extension';
import { createComponentContextStub } from '../../test-tools/stubs';
import { SwitchStepComponentView } from './switch-step-component-view';

describe('SwitchStepComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');

		const step: SwitchStep = {
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
		const stepContext: StepContext<SwitchStep> = {
			depth: 0,
			position: 0,
			isInputConnected: true,
			isOutputConnected: true,
			parentSequence: [],
			step
		};
		const componentContext = createComponentContextStub();

		SwitchStepComponentView.create(parent, stepContext, componentContext);
		expect(parent.children.length).not.toEqual(0);
	});
});
