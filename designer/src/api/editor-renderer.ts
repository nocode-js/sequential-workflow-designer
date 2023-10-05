import { DefinitionWalker, Step } from '../definition';
import { race } from '../core';
import { DefinitionChangedEvent, DesignerState } from '../designer-state';
import { DefinitionChangeType } from '../designer-configuration';

export type EditorRendererHandler = (step: Step | null) => void;

export class EditorRenderer {
	public static create(state: DesignerState, definitionWalker: DefinitionWalker, handler: EditorRendererHandler): EditorRenderer {
		const listener = new EditorRenderer(state, definitionWalker, handler);

		race(0, state.onDefinitionChanged, state.onSelectedStepIdChanged).subscribe(r => {
			const [definitionChanged, selectedStepId] = r;
			if (definitionChanged) {
				listener.onDefinitionChanged(definitionChanged);
			} else if (selectedStepId !== undefined) {
				listener.onSelectedStepIdChanged(selectedStepId);
			}
		});

		listener.tryRender(state.selectedStepId);
		return listener;
	}

	private currentStepId: string | null | undefined = undefined;

	private constructor(
		private readonly state: DesignerState,
		private readonly definitionWalker: DefinitionWalker,
		private readonly handler: EditorRendererHandler
	) {}

	public destroy() {
		// TODO: unsubscribe from events
	}

	private render(stepId: string | null) {
		const step = stepId ? this.definitionWalker.getById(this.state.definition, stepId) : null;
		this.currentStepId = stepId;
		this.handler(step);
	}

	private tryRender(stepId: string | null) {
		if (this.currentStepId !== stepId) {
			this.render(stepId);
		}
	}

	private onDefinitionChanged(event: DefinitionChangedEvent) {
		if (event.changeType === DefinitionChangeType.rootReplaced) {
			this.render(this.state.selectedStepId);
		} else {
			this.tryRender(this.state.selectedStepId);
		}
	}

	private onSelectedStepIdChanged(stepId: string | null) {
		this.tryRender(stepId);
	}
}
