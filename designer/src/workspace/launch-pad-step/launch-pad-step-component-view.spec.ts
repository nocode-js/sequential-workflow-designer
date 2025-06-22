import { Dom } from '../../core/dom';
import { SequentialStep } from '../../definition';
import { StepContext } from '../../designer-extension';
import { createComponentContextStub } from '../../test-tools/stubs';
import { StepComponentViewContextFactory } from '../step-component-view-context-factory';
import { createLaunchPadStepComponentViewFactory } from './launch-pad-step-component-view';

describe('LaunchPadStepComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		const step: SequentialStep = {
			id: '0x',
			componentType: 'launchPad',
			name: 'x',
			properties: {},
			type: 'launchPad',
			sequence: []
		};
		const stepContext: StepContext<SequentialStep> = {
			depth: 0,
			position: 0,
			isInputConnected: true,
			isOutputConnected: false,
			step,
			parentSequence: [step],
			isPreview: false
		};
		const componentContext = createComponentContextStub();
		const viewContext = StepComponentViewContextFactory.create(stepContext, componentContext);

		const factory = createLaunchPadStepComponentViewFactory(false, {
			isRegionEnabled: true,
			paddingY: 10,
			connectionHeight: 20,
			emptyPaddingX: 20,
			emptyPaddingY: 20,
			emptyInputSize: 14,
			emptyOutputSize: 10,
			emptyIconSize: 24
		});
		factory(parent, stepContext, viewContext);

		expect(parent.children.length).not.toEqual(0);
	});
});
