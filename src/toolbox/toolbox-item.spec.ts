import { Dom } from '../core/dom';
import { ComponentType, Step } from '../definition';
import { createDesignerContextStub } from '../test-tools/stubs';
import { ToolboxItem } from './toolbox-item';

describe('ToolboxItem', () => {
	it('create() creates item', () => {
		const parent = Dom.element('div');
		const context = createDesignerContextStub();
		const step: Step = {
			id: '0x0',
			componentType: ComponentType.task,
			name: 'x',
			properties: {},
			type: 'y'
		};

		const item = ToolboxItem.create(parent, step, context);

		expect(item).toBeDefined();
	});
});
