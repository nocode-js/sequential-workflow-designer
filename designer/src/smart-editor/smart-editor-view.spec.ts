import { Dom } from '../core/dom';
import { createDesignerApiStub, getEditorsConfigurationStub } from '../test-tools/stubs';
import { SmartEditorView } from './smart-editor-view';

describe('SmartEditorView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');
		const api = createDesignerApiStub();
		const configuration = getEditorsConfigurationStub();

		const view = SmartEditorView.create(parent, api.editor, configuration);

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
