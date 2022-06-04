import { Dom } from '../core/dom';
import { EditorView } from './editor';

export class SmartEditorView {
	public static create(parent: HTMLElement): SmartEditorView {
		const root = Dom.element('div', {
			class: 'sqd-smart-editor'
		});
		parent.appendChild(root);
		return new SmartEditorView(root);
	}

	private view?: EditorView;

	private constructor(private readonly editor: HTMLElement) {}

	public setView(view: EditorView) {
		if (this.view) {
			this.editor.removeChild(this.view.root);
		}
		this.editor.appendChild(view.root);
		this.view = view;
	}
}
