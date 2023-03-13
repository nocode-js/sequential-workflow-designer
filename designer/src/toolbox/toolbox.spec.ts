import { Dom } from '../core/dom';
import { createDesignerApiStub, getToolboxConfigurationStub } from '../test-tools/stubs';
import { Toolbox } from './toolbox';

describe('Toolbox', () => {
	it('create() creates toolbox', () => {
		const parent = Dom.element('div');
		const configuration = getToolboxConfigurationStub();
		const api = createDesignerApiStub();

		const item = Toolbox.create(parent, api, configuration);

		expect(item).toBeDefined();
	});
});
