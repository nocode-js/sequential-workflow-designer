import { Dom } from '../core/dom';
import { GlobalEditorView } from './global-editor-view';

describe('GlobalEditorView', () => {
	it('create() creates view', () => {
		const p = Dom.element('p');

		const view = GlobalEditorView.create(p);

		expect(view.root.contains(p)).toBeTrue();
	});
});
