import { Dom } from '../core/dom';
import { createDesignerContextStub } from '../test-tools/stubs';
import { Workspace } from './workspace';

describe('Workspace', () => {
	it('create() creates bar', () => {
		const parent = Dom.element('div');
		const designerContext = createDesignerContextStub();

		const bar = Workspace.create(parent, designerContext);

		expect(bar).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
