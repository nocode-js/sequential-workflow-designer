import { race, SimpleEvent } from '../core';
import { StateModifier } from '../modifier/state-modifier';
import { DesignerState } from '../designer-state';
import { HistoryController } from '../history-controller';
import { ControlBarConfiguration, ControlBarButton, ControlBarButtonClickedCustomAction } from '../designer-configuration';
import { CustomActionController } from '../custom-action-controller';

export class ControlBarApi {
	public static create(
		state: DesignerState,
		historyController: HistoryController | undefined,
		customActionController: CustomActionController,
		stateModifier: StateModifier,
		configuration: ControlBarConfiguration | boolean
	): ControlBarApi {
		const api = new ControlBarApi(state, historyController, customActionController, stateModifier, configuration);

		race(
			0,
			state.onIsReadonlyChanged,
			state.onSelectedStepIdChanged,
			state.onIsDragDisabledChanged,
			api.isUndoRedoSupported() ? state.onDefinitionChanged : undefined
		).subscribe(api.onStateChanged.emit);
		return api;
	}

	private constructor(
		private readonly state: DesignerState,
		private readonly historyController: HistoryController | undefined,
		private readonly customActionController: CustomActionController,
		private readonly stateModifier: StateModifier,
		private readonly configuration: ControlBarConfiguration | boolean
	) {}

	public readonly onStateChanged = new SimpleEvent<unknown>();

	public isDragDisabled(): boolean {
		return this.state.isDragDisabled;
	}

	public setIsDragDisabled(isDragDisabled: boolean) {
		this.state.setIsDragDisabled(isDragDisabled);
	}

	public toggleIsDragDisabled() {
		this.setIsDragDisabled(!this.isDragDisabled());
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
			return this.stateModifier.tryDeleteById(this.state.selectedStepId);
		}
		return false;
	}

	public canDelete(): boolean {
		return (
			!!this.state.selectedStepId &&
			!this.state.isReadonly &&
			!this.state.isDragging &&
			this.stateModifier.isDeletableById(this.state.selectedStepId)
		);
	}

	public getButtons(): ControlBarButton[] | null {
		return typeof this.configuration === 'boolean' ? null : this.configuration.buttons || null;
	}

	public triggerButtonClick(id: string) {
		const action: ControlBarButtonClickedCustomAction = {
			type: 'controlBarButtonClicked',
			id
		};
		this.customActionController.trigger(action, null, this.state.definition.sequence);
	}
}
