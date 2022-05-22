import { Step } from '../definition';
import { Workspace } from '../workspace/workspace';
import { EditorView } from './editor';
import { GlobalEditor } from './global-editor';
import { StepEditor } from './step-editor';

export class SmartEditor {

	public static append(parent: HTMLElement, workspace: Workspace): SmartEditor {
		const view = SmartEditorView.create(parent);
		const editor = new SmartEditor(view);
		editor.onSelectedStepChanged(null);
		workspace.onSelectedStepChanged.subscribe(s => editor.onSelectedStepChanged(s));
		return editor;
	}

	private constructor(
		private readonly view: SmartEditorView) {
	}

	private onSelectedStepChanged(step: Step | null) {
		const editor = step
			? StepEditor.create(step)
			: GlobalEditor.create();
		this.view.setView(editor.view);
	}
}

class SmartEditorView {

	public static create(parent: HTMLElement): SmartEditorView {
		const editor = document.createElement('div');
		editor.className = 'sqd-smart-editor';

		parent.appendChild(editor);
		return new SmartEditorView(editor);
	}

	private view?: EditorView;

	private constructor(
		private readonly editor: HTMLElement) {
	}

	public setView(view: EditorView) {
		if (this.view) {
			this.editor.removeChild(this.view.element);
		}
		this.editor.appendChild(view.element);
		this.view = view;
	}
}
