import { Dom } from '../core/dom';
import { createDesignerApiStub } from '../test-tools/stubs';
import { ToolboxView } from './toolbox-view';

describe('ToolboxView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');
		const api = createDesignerApiStub();

		const view = ToolboxView.create(parent, api.toolbox);

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
