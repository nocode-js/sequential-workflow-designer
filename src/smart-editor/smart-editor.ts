import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { GlobalEditor } from './global-editor';
import { SmartEditorView } from './smart-editor-view';
import { StepEditor } from './step-editor';

export class SmartEditor {
	public static create(parent: HTMLElement, context: DesignerContext): SmartEditor {
		const view = SmartEditorView.create(parent);
		view.setIsCollapsed(context.isSmartEditorCollapsed);

		const editor = new SmartEditor(view, context);
		view.bindToggleIsCollapsedClick(() => editor.toggleIsCollapsedClick());
		editor.tryRender(null);
		context.onSelectedStepChanged.subscribe(s => editor.onSelectedStepChanged(s));
		context.onDefinitionChanged.subscribe(() => editor.onDefinitionChanged());
		context.onIsSmartEditorCollapsedChanged.subscribe(ic => view.setIsCollapsed(ic));
		return editor;
	}

	private currentStep?: Step | null = undefined;

	private constructor(private readonly view: SmartEditorView, private readonly context: DesignerContext) {}

	public toggleIsCollapsedClick() {
		this.context.toggleIsSmartEditorCollapsed();
	}

	private onSelectedStepChanged(step: Step | null) {
		this.tryRender(step);
	}

	private onDefinitionChanged() {
		this.tryRender(this.context.selectedStep);
	}

	private tryRender(step: Step | null) {
		if (this.currentStep !== step) {
			const editor = step ? StepEditor.create(step, this.context) : GlobalEditor.create(this.context.definition, this.context);
			this.currentStep = step;
			this.view.setView(editor.view);
		}
	}
}
