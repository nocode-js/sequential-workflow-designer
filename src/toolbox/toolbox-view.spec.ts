import { Dom } from '../core/dom';
import { createDesignerContextStub } from '../test-tools/stubs';
import { ToolboxView } from './toolbox-view';

describe('ToolboxView', () => {

	it('create() creates view', () => {
		const parent = Dom.element('div');
		const context = createDesignerContextStub();

		const view = ToolboxView.create(parent, context);

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
