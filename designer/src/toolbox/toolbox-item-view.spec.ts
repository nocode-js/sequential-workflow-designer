import { Dom } from '../core/dom';
import { Step } from '../definition';
import { createDesignerApiStub } from '../test-tools/stubs';
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
		const api = createDesignerApiStub();

		const view = ToolboxItemView.create(parent, step, api.toolbox);

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
