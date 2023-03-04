import { Dom } from '../../core/dom';
import { Step } from '../../definition';
import { StepContext } from '../../designer-extension';
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
		TaskStepComponentView.create(parent, stepContext, {}, false);
		expect(parent.children.length).not.toEqual(0);
	});
});
