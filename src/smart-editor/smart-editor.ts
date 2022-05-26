import { Dom } from '../core/dom';
import { DesignerContext } from '../designer-context';
import { StepComponent } from '../workspace/component';
import { EditorView } from './editor';
import { GlobalEditor } from './global-editor';
import { StepEditor } from './step-editor';

export class SmartEditor {

	public static append(parent: HTMLElement, context: DesignerContext): SmartEditor {
		const view = SmartEditorView.append(parent);
		const editor = new SmartEditor(view, context);
		editor.render(null);
		context.onSelectedStepComponentChanged.subscribe(s => editor.onSelectedStepChanged(s));
		context.onDefinitionChanged.subscribe(() => editor.onDefinitionChanged());
		return editor;
	}

	private constructor(
		private readonly view: SmartEditorView,
		private readonly context: DesignerContext) {
	}

	private render(stepComponent: StepComponent | null) {
		const editor = stepComponent
			? StepEditor.create(stepComponent.step, this.context.configuration.editors)
			: GlobalEditor.create(this.context.definition, this.context.configuration.editors);
		this.view.setView(editor.view);
	}

	private onSelectedStepChanged(stepComponent: StepComponent | null) {
		this.render(stepComponent);
	}

	private onDefinitionChanged() {
		this.render(null);
	}
}

class SmartEditorView {

	public static append(parent: HTMLElement): SmartEditorView {
		const root = Dom.element('div', {
			class: 'sqd-smart-editor'
		});
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
