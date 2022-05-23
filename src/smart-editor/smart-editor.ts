import { DesignerContext } from '../designer-context';
import { StepComponent } from '../workspace/component';
import { EditorView } from './editor';
import { GlobalEditor } from './global-editor';
import { StepEditor } from './step-editor';

export class SmartEditor {

	public static append(parent: HTMLElement, context: DesignerContext): SmartEditor {
		const view = SmartEditorView.create(parent);
		const editor = new SmartEditor(view);
		editor.onSelectedStepChanged(null);
		context.onSelectedStepComponentChanged.subscribe(s => editor.onSelectedStepChanged(s));
		return editor;
	}

	private constructor(
		private readonly view: SmartEditorView) {
	}

	private onSelectedStepChanged(stepComponent: StepComponent | null) {
		const editor = stepComponent
			? StepEditor.create(stepComponent.step)
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
