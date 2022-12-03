import { race } from '../core/simple-event-race';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { DefinitionChangedEvent, DefinitionChangeType, DesignerState } from '../designer-state';
import { GlobalEditor } from './global-editor';
import { SmartEditorView } from './smart-editor-view';
import { StepEditor } from './step-editor';

export class SmartEditor {
	public static create(parent: HTMLElement, context: DesignerContext): SmartEditor {
		const view = SmartEditorView.create(parent);
		view.setIsCollapsed(context.state.isSmartEditorCollapsed);

		const editor = new SmartEditor(view, context, context.state);
		view.bindToggleIsCollapsedClick(() => editor.toggleIsCollapsedClick());
		editor.tryRender(null);

		race(0, context.state.onDefinitionChanged, context.state.onSelectedStepChanged).subscribe(r => {
			const [definitionChanged, selectedStep] = r;
			if (definitionChanged) {
				editor.onDefinitionChanged(definitionChanged);
			} else if (selectedStep !== undefined) {
				editor.onSelectedStepChanged(selectedStep);
			}
		});

		context.state.onIsSmartEditorCollapsedChanged.subscribe(ic => view.setIsCollapsed(ic));
		return editor;
	}

	private currentStep?: Step | null = undefined;

	private constructor(
		private readonly view: SmartEditorView,
		private readonly context: DesignerContext,
		private readonly state: DesignerState
	) {}

	public toggleIsCollapsedClick() {
		this.state.toggleIsSmartEditorCollapsed();
	}

	private onSelectedStepChanged(step: Step | null) {
		this.tryRender(step);
	}

	private onDefinitionChanged(event: DefinitionChangedEvent) {
		if (event.changeType === DefinitionChangeType.rootReplaced) {
			this.render(this.state.selectedStep);
		} else {
			this.tryRender(this.state.selectedStep);
		}
	}

	private tryRender(step: Step | null) {
		if (this.currentStep !== step) {
			this.render(step);
		}
	}

	private render(step: Step | null) {
		const editor = step ? StepEditor.create(step, this.context) : GlobalEditor.create(this.state.definition, this.context);
		this.currentStep = step;
		this.view.setView(editor.view);
	}
}
