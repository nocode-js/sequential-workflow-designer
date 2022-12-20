import { Dom } from '../core/dom';
import { createComponentContextStub, createDesignerContextStub } from '../test-tools/stubs';
import { Workspace } from './workspace';

describe('Workspace', () => {
	it('create() creates bar', () => {
		const parent = Dom.element('div');
		const designerContext = createDesignerContextStub();
		const componentContext = createComponentContextStub();

		const bar = Workspace.create(parent, designerContext, componentContext);

		expect(bar).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
