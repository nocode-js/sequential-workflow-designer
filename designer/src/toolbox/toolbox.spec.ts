import { Dom } from '../core/dom';
import { createDesignerApiStub } from '../test-tools/stubs';
import { Toolbox } from './toolbox';

describe('Toolbox', () => {
	it('create() creates toolbox', () => {
		const parent = Dom.element('div');
		const api = createDesignerApiStub();

		const item = Toolbox.create(parent, api.toolbox);

		expect(item).toBeDefined();
	});
});
