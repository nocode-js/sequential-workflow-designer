import { Editor, EditorView } from './editor';

export class GlobalEditor implements Editor {

	public static create(): GlobalEditor {
		const view = GlobalEditorView.create();
		return new GlobalEditor(view);
	}

	private constructor(
		public readonly view: GlobalEditorView) {
	}
}

class GlobalEditorView implements EditorView {

	public static create(): GlobalEditorView {
		const se = document.createElement('div');
		se.className = 'sqd-global-editor';
		se.innerText = 'global editor';
		return new GlobalEditorView(se);
	}

	private constructor(
		public readonly element: HTMLElement) {
	}
}
