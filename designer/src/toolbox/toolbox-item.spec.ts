import { Dom } from '../core/dom';
import { Step } from '../definition';
import { createDesignerApiStub } from '../test-tools/stubs';
import { ToolboxItem } from './toolbox-item';

describe('ToolboxItem', () => {
	it('create() creates item', () => {
		const parent = Dom.element('div');
		const step: Step = {
			id: '0x0',
			componentType: 'task',
			name: 'x',
			properties: {},
			type: 'foo'
		};
		const api = createDesignerApiStub();

		const item = ToolboxItem.create(parent, step, api.toolbox);

		expect(item).toBeDefined();
	});
});
