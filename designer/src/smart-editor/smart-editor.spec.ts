import { Dom } from '../core/dom';
import { createDesignerApiStub, getEditorsConfigurationStub } from '../test-tools/stubs';
import { SmartEditor } from './smart-editor';

describe('SmartEditor', () => {
	it('create() creates editor', () => {
		const parent = Dom.element('div');

		const configuration = getEditorsConfigurationStub();
		const api = createDesignerApiStub();

		const editor = SmartEditor.create(parent, api, configuration);

		expect(editor).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
