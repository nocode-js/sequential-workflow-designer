import { Dom } from '../core/dom';
import { createDesignerContextStub } from '../test-tools/stubs';
import { Toolbox } from './toolbox';

describe('Toolbox', () => {
	it('create() creates toolbox', () => {
		const parent = Dom.element('div');
		const designerContext = createDesignerContextStub();

		const item = Toolbox.create(parent, designerContext);

		expect(item).toBeDefined();
	});
});
