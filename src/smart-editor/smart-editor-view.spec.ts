import { Dom } from '../core/dom';
import { SmartEditorView } from './smart-editor-view';

describe('SmartEditorView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');

		const view = SmartEditorView.create(parent);

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
