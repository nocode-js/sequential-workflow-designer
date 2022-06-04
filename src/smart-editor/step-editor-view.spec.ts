import { Dom } from '../core/dom';
import { StepEditorView } from './step-editor-view';

describe('StepEditorView', () => {
	it('create() creates view', () => {
		const p = Dom.element('p');

		const view = StepEditorView.create(p);

		expect(view).toBeDefined();
		expect(view.root.contains(p)).toBeTrue();
	});
});
