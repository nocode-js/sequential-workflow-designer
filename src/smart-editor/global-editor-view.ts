import { Dom } from '../core/dom';
import { EditorView } from './editor';

export class GlobalEditorView implements EditorView {
	public static create(content: HTMLElement): GlobalEditorView {
		const se = Dom.element('div', {
			class: 'sqd-global-editor'
		});
		se.appendChild(content);
		return new GlobalEditorView(se);
	}

	private constructor(public readonly root: HTMLElement) {}
}
