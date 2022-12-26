import { Dom } from '../../core/dom';
import { TaskStepComponentView } from './task-step-component-view';

describe('TaskStepComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		TaskStepComponentView.create(
			parent,
			false,
			{
				id: '0x',
				componentType: 'task',
				name: 'x',
				properties: {},
				type: 'test'
			},
			{}
		);
		expect(parent.children.length).not.toEqual(0);
	});
});
