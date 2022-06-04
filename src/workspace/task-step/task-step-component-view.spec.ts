import { Dom } from '../../core/dom';
import { ComponentType } from '../../definition';
import { TaskStepComponentView } from './task-step-component-view';

describe('TaskStepComponentView', () => {

	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		TaskStepComponentView.create(parent, {
			id: '0x',
			componentType: ComponentType.task,
			name: 'x',
			properties: {},
			type: 'test'
		}, {});
		expect(parent.children.length).not.toEqual(0);
	});
});
