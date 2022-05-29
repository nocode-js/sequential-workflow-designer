import { Dom } from '../core/dom';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { EditorView } from './editor';
import { GlobalEditor } from './global-editor';
import { StepEditor } from './step-editor';

export class SmartEditor {

	public static create(parent: HTMLElement, context: DesignerContext): SmartEditor {
		const view = SmartEditorView.create(parent);
		const editor = new SmartEditor(view, context);
		editor.tryRender(null);
		context.onSelectedStepChanged.subscribe(s => editor.onSelectedStepChanged(s));
		context.onDefinitionChanged.subscribe(() => editor.onDefinitionChanged());
		return editor;
	}

	private currentStep?: Step | null = undefined;

	private constructor(
		private readonly view: SmartEditorView,
		private readonly context: DesignerContext) {
	}

	private onSelectedStepChanged(step: Step | null) {
		this.tryRender(step);
	}

	private onDefinitionChanged() {
		this.tryRender(this.context.selectedStep);
	}

	private tryRender(step: Step | null) {
		if (this.currentStep !== step) {
			const editor = step
				? StepEditor.create(step, this.context.configuration.editors)
				: GlobalEditor.create(this.context.definition, this.context.configuration.editors);
			this.currentStep = step;
			this.view.setView(editor.view);
		}
	}
}

class SmartEditorView {

	public static create(parent: HTMLElement): SmartEditorView {
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
