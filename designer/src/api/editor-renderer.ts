import { DefinitionWalker, Step } from '../definition';
import { SimpleEvent, race } from '../core';
import { DefinitionChangedEvent, DesignerState } from '../designer-state';
import { DefinitionChangeType } from '../designer-configuration';

export type EditorRendererHandler = (step: Step | null) => void;

type RaceEventArgs = [(DefinitionChangedEvent | undefined)?, (string | null | undefined)?, (boolean | undefined)?];

export class EditorRenderer {
	public static create(state: DesignerState, definitionWalker: DefinitionWalker, handler: EditorRendererHandler): EditorRenderer {
		const raceEvent = race(0, state.onDefinitionChanged, state.onSelectedStepIdChanged, state.onIsReadonlyChanged);
		const listener = new EditorRenderer(state, definitionWalker, handler, raceEvent);
		raceEvent.subscribe(listener.raceEventHandler);
		listener.renderIfStepChanged(state.selectedStepId);
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

	private renderIfStepChanged(stepId: string | null) {
		if (this.currentStepId !== stepId) {
			this.render(stepId);
		}
	}

	private readonly raceEventHandler = ([definitionChanged, selectedStepId, isReadonlyChanged]: RaceEventArgs) => {
		if (isReadonlyChanged !== undefined) {
			this.render(this.state.selectedStepId);
		} else if (definitionChanged) {
			if (definitionChanged.changeType === DefinitionChangeType.rootReplaced) {
				this.render(this.state.selectedStepId);
			} else {
				this.renderIfStepChanged(this.state.selectedStepId);
			}
		} else if (selectedStepId !== undefined) {
			this.renderIfStepChanged(selectedStepId);
		}
	};
}
