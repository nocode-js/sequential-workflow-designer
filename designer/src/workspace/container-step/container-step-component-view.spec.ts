import { Dom } from '../../core/dom';
import { SequentialStep } from '../../definition';
import { StepContext } from '../../designer-extension';
import { createComponentContextStub } from '../../test-tools/stubs';
import { StepComponentViewContextFactory } from '../step-component-view-context-factory';
import { createContainerStepComponentViewFactory } from './container-step-component-view';

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
		const viewContext = StepComponentViewContextFactory.create(stepContext, componentContext);

		const factory = createContainerStepComponentViewFactory({
			inputIconSize: 10,
			inputSize: 14,
			paddingTop: 20,
			paddingX: 20,
			label: {
				height: 22,
				minWidth: 50,
				paddingX: 10,
				radius: 10
			}
		});
		const view = factory(parent, stepContext, viewContext);

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
