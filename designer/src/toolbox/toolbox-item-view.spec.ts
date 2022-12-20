import { Dom } from '../core/dom';
import { Step } from '../definition';
import { ToolboxItemView } from './toolbox-item-view';

describe('ToolboxItemView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');
		const step: Step = {
			id: '0x0',
			componentType: 'task',
			name: 'x',
			properties: {},
			type: 'y'
		};

		const view = ToolboxItemView.create(parent, step, {});

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
