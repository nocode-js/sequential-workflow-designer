import { Dom } from '../core/dom';
import { Step } from '../definition';
import { createDesignerContextStub } from '../test-tools/stubs';
import { ToolboxItem } from './toolbox-item';

describe('ToolboxItem', () => {
	it('create() creates item', () => {
		const parent = Dom.element('div');
		const designerContext = createDesignerContextStub();
		const step: Step = {
			id: '0x0',
			componentType: 'task',
			name: 'x',
			properties: {},
			type: 'foo'
		};

		const item = ToolboxItem.create(parent, step, designerContext);

		expect(item).toBeDefined();
	});
});
