import { ToolboxItemData } from './toolbox-data-provider';
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
			name: 'Send email',
			properties: {},
			type: 'sendEmail'
		};
		const data: ToolboxItemData = {
			iconUrl: null,
			label: 'Send email',
			lowerCaseLabel: 'send email',
			description: 'Some description',
			step
		};

		const api = createDesignerApiStub();

		const item = ToolboxItem.create(parent, data, api.toolbox);

		expect(item).toBeDefined();
	});
});
