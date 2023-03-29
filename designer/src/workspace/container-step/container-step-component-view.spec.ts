import { Dom } from '../../core/dom';
import { SequentialStep } from '../../definition';
import { StepContext } from '../../designer-extension';
import { createComponentContextStub } from '../../test-tools/stubs';
import { ContainerStepComponentView } from './container-step-component-view';

describe('ContainerStepComponentView', () => {
	it('creates view', () => {
		const step: SequentialStep = {
			id: '0x0',
			componentType: 'container',
			name: 'Foo',
			properties: {},
			sequence: [],
			type: 'foo'
		};

		const parent = Dom.svg('svg');
		const stepContext: StepContext<SequentialStep> = {
			step,
			depth: 0,
			position: 0,
			isInputConnected: true,
			isOutputConnected: true,
			parentSequence: []
		};
		const componentContext = createComponentContextStub();
		const view = ContainerStepComponentView.create(parent, stepContext, componentContext, {
			inputIconSize: 10,
			inputSize: 14,
			paddingTop: 20,
			paddingX: 20,
			labelHeight: 22,
			labelMinWidth: 50,
			labelPaddingX: 10,
			labelRadius: 10
		});

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
