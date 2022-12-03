import { Dom } from '../core/dom';
import { createDesignerContextStub } from '../test-tools/stubs';
import { Toolbox } from './toolbox';

describe('Toolbox', () => {
	it('create() creates toolbox', () => {
		const parent = Dom.element('div');
		const context = createDesignerContextStub();

		const item = Toolbox.create(parent, context);

		expect(item).toBeDefined();
	});
});
