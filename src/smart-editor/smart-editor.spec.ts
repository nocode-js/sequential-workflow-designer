import { Dom } from '../core/dom';
import { createDesignerContextStub } from '../test-tools/stubs';
import { SmartEditor } from './smart-editor';

describe('SmartEditor', () => {

	it('create() creates editor', () => {
		const parent = Dom.element('div');
		const context = createDesignerContextStub();

		const editor = SmartEditor.create(parent, context);

		expect(editor).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
