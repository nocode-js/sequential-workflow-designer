import { Dom } from '../core/dom';
import { createComponentContextStub, createDesignerContextStub } from '../test-tools/stubs';
import { ToolboxView } from './toolbox-view';

describe('ToolboxView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');
		const designerContext = createDesignerContextStub();
		const componentContext = createComponentContextStub();

		const view = ToolboxView.create(parent, designerContext, componentContext);

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
