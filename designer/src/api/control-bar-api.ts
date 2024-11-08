import { race, SimpleEvent } from '../core';
import { StateModifier } from '../modifier/state-modifier';
import { DesignerState } from '../designer-state';
import { HistoryController } from '../history-controller';

export class ControlBarApi {
	public static create(
		state: DesignerState,
		historyController: HistoryController | undefined,
		stateModifier: StateModifier
	): ControlBarApi {
		const api = new ControlBarApi(state, historyController, stateModifier);

		race(
			0,
			state.onIsReadonlyChanged,
			state.onSelectedStepIdChanged,
			state.onIsDragDisabledChanged,
			api.isUndoRedoSupported() ? state.onDefinitionChanged : undefined
		).subscribe(api.onStateChanged.forward);
		return api;
	}

	private constructor(
		private readonly state: DesignerState,
		private readonly historyController: HistoryController | undefined,
		private readonly stateModifier: StateModifier
	) {}

	public readonly onStateChanged = new SimpleEvent<unknown>();

	public isDragDisabled(): boolean {
		return this.state.isDragDisabled;
	}

	public toggleIsDragDisabled() {
		this.state.toggleIsDragDisabled();
	}

	public isUndoRedoSupported(): boolean {
		return !!this.historyController;
	}

	public tryUndo(): boolean {
		if (this.canUndo() && this.historyController) {
			this.historyController.undo();
			return true;
		}
		return false;
	}

	public canUndo(): boolean {
		return !!this.historyController && this.historyController.canUndo() && !this.state.isReadonly && !this.state.isDragging;
	}

	public tryRedo(): boolean {
		if (this.canRedo() && this.historyController) {
			this.historyController.redo();
			return true;
		}
		return false;
	}

	public canRedo(): boolean {
		return !!this.historyController && this.historyController.canRedo() && !this.state.isReadonly && !this.state.isDragging;
	}

	public tryDelete(): boolean {
		if (this.canDelete() && this.state.selectedStepId) {
			this.stateModifier.tryDelete(this.state.selectedStepId);
			return true;
		}
		return false;
	}

	public canDelete(): boolean {
		return (
			!!this.state.selectedStepId &&
			!this.state.isReadonly &&
			!this.state.isDragging &&
			this.stateModifier.isDeletable(this.state.selectedStepId)
		);
	}
}
