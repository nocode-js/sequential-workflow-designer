import { DefinitionWalker, Step } from '../definition';
import { SimpleEvent, race } from '../core';
import { DefinitionChangedEvent, DesignerState } from '../designer-state';
import { DefinitionChangeType } from '../designer-configuration';

export type EditorRendererHandler = (step: Step | null) => void;

type RaceEventArgs = [(DefinitionChangedEvent | undefined)?, (string | null | undefined)?, unknown?];

export class EditorRenderer {
	public static create(state: DesignerState, definitionWalker: DefinitionWalker, handler: EditorRendererHandler): EditorRenderer {
		const raceEvent = race(0, state.onDefinitionChanged, state.onSelectedStepIdChanged);
		const listener = new EditorRenderer(state, definitionWalker, handler, raceEvent);
		raceEvent.subscribe(listener.raceEventHandler);
		listener.tryRender(state.selectedStepId);
		return listener;
	}

	private currentStepId: string | null | undefined = undefined;

	private constructor(
		private readonly state: DesignerState,
		private readonly definitionWalker: DefinitionWalker,
		private readonly handler: EditorRendererHandler,
		private readonly raceEvent: SimpleEvent<RaceEventArgs>
	) {}

	public destroy() {
		this.raceEvent.unsubscribe(this.raceEventHandler);
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

	private readonly raceEventHandler = ([definitionChanged, selectedStepId]: RaceEventArgs) => {
		if (definitionChanged) {
			this.onDefinitionChanged(definitionChanged);
		} else if (selectedStepId !== undefined) {
			this.onSelectedStepIdChanged(selectedStepId);
		}
	};

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
