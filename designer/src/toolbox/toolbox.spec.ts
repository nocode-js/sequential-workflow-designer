import { Dom } from '../core/dom';
import { createComponentContextStub, createDesignerContextStub } from '../test-tools/stubs';
import { Toolbox } from './toolbox';

describe('Toolbox', () => {
	it('create() creates toolbox', () => {
		const parent = Dom.element('div');
		const designerContext = createDesignerContextStub();
		const componentContext = createComponentContextStub();

		const item = Toolbox.create(parent, designerContext, componentContext);

		expect(item).toBeDefined();
	});
});
