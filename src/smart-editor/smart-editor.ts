import { DesignerContext } from '../designer-context';
import { StepComponent } from '../workspace/component';
import { EditorView } from './editor';
import { GlobalEditor } from './global-editor';
import { StepEditor } from './step-editor';

export class SmartEditor {

	public static append(parent: HTMLElement, context: DesignerContext): SmartEditor {
		const view = SmartEditorView.append(parent);
		const editor = new SmartEditor(view, context);
		editor.onSelectedStepChanged(null);
		context.onSelectedStepComponentChanged.subscribe(s => editor.onSelectedStepChanged(s));
		return editor;
	}

	private constructor(
		private readonly view: SmartEditorView,
		private readonly context: DesignerContext) {
	}

	private onSelectedStepChanged(stepComponent: StepComponent | null) {
		const editor = stepComponent
			? StepEditor.create(stepComponent.step, this.context.configuration)
			: GlobalEditor.create(this.context.definition, this.context.configuration);
		this.view.setView(editor.view);
	}
}

class SmartEditorView {

	public static append(parent: HTMLElement): SmartEditorView {
		const root = document.createElement('div');
		root.className = 'sqd-smart-editor';

		parent.appendChild(root);
		return new SmartEditorView(root);
	}

	private view?: EditorView;

	private constructor(
		private readonly editor: HTMLElement) {
	}

	public setView(view: EditorView) {
		if (this.view) {
			this.editor.removeChild(this.view.root);
		}
		this.editor.appendChild(view.root);
		this.view = view;
	}
}
