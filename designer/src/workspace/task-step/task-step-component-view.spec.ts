import { Dom } from '../../core/dom';
import { Step } from '../../definition';
import { StepContext } from '../../designer-extension';
import { createComponentContextStub } from '../../test-tools/stubs';
import { TaskStepComponentView } from './task-step-component-view';

describe('TaskStepComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		const step: Step = {
			id: '0x',
			componentType: 'task',
			name: 'x',
			properties: {},
			type: 'test'
		};
		const stepContext: StepContext<Step> = {
			depth: 0,
			position: 0,
			isInputConnected: true,
			isOutputConnected: false,
			step,
			parentSequence: [step]
		};
		const componentContext = createComponentContextStub();
		TaskStepComponentView.create(parent, stepContext, false, componentContext, {
			iconSize: 20,
			minTextWidth: 50,
			textMarginLeft: 10,
			paddingX: 10,
			paddingY: 10,
			radius: 5,
			inputSize: 10,
			outputSize: 10
		});
		expect(parent.children.length).not.toEqual(0);
	});
});
