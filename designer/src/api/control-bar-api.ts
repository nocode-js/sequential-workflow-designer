import { DefinitionModifier } from '../definition-modifier';
import { DesignerState } from '../designer-state';
import { HistoryController } from '../history-controller';
import { WorkspaceController } from '../workspace/workspace-controller';

export class ControlBarApi {
	public constructor(
		private readonly state: DesignerState,
		private readonly workspaceController: WorkspaceController,
		private readonly historyController: HistoryController | undefined,
		private readonly definitionModifier: DefinitionModifier
	) {}

	/**
	 * @deprecated Don't use this method
	 */
	public subscribe(handler: () => void) {
		// TODO: this should be refactored

		this.state.onIsReadonlyChanged.subscribe(handler);
		this.state.onSelectedStepIdChanged.subscribe(handler);
		this.state.onIsDragDisabledChanged.subscribe(handler);
		if (this.isUndoRedoSupported()) {
			this.state.onDefinitionChanged.subscribe(handler);
		}
	}

	public resetViewPort() {
		this.workspaceController.resetViewPort();
	}

	public zoomIn() {
		this.workspaceController.zoom(true);
	}

	public zoomOut() {
		this.workspaceController.zoom(false);
	}

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
			this.definitionModifier.tryDelete(this.state.selectedStepId);
			return true;
		}
		return false;
	}

	public canDelete(): boolean {
		return (
			!!this.state.selectedStepId &&
			!this.state.isReadonly &&
			!this.state.isDragging &&
			this.definitionModifier.isDeletable(this.state.selectedStepId)
		);
	}
}
