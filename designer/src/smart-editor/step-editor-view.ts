import { Dom } from '../core/dom';
import { EditorView } from './editor';

export class StepEditorView implements EditorView {
	public static create(content: HTMLElement): StepEditorView {
		const root = Dom.element('div', {
			class: 'sqd-step-editor'
		});
		root.appendChild(content);
		return new StepEditorView(root);
	}

	private constructor(public readonly root: HTMLElement) {}
}
