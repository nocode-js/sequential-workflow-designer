import { race } from '../core/simple-event-race';
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

		race(0, context.state.onDefinitionChanged, context.state.onSelectedStepIdChanged).subscribe(r => {
			const [definitionChanged, selectedStepId] = r;
			if (definitionChanged) {
				editor.onDefinitionChanged(definitionChanged);
			} else if (selectedStepId !== undefined) {
				editor.onSelectedStepIdChanged(selectedStepId);
			}
		});

		context.state.onIsSmartEditorCollapsedChanged.subscribe(ic => view.setIsCollapsed(ic));
		return editor;
	}

	private currentStepId?: string | null = undefined;

	private constructor(
		private readonly view: SmartEditorView,
		private readonly context: DesignerContext,
		private readonly state: DesignerState
	) {}

	public toggleIsCollapsedClick() {
		this.state.toggleIsSmartEditorCollapsed();
	}

	private onSelectedStepIdChanged(stepId: string | null) {
		this.tryRender(stepId);
	}

	private onDefinitionChanged(event: DefinitionChangedEvent) {
		if (event.changeType === DefinitionChangeType.rootReplaced) {
			this.render(this.state.selectedStepId);
		} else {
			this.tryRender(this.state.selectedStepId);
		}
	}

	private tryRender(stepId: string | null) {
		if (this.currentStepId !== stepId) {
			this.render(stepId);
		}
	}

	private render(stepId: string | null) {
		const step = stepId ? this.context.stepsTraverser.getById(this.context.state.definition, stepId) : null;
		const editor = step ? StepEditor.create(step, this.context) : GlobalEditor.create(this.state.definition, this.context);
		this.currentStepId = stepId;
		this.view.setView(editor.view);
	}
}
