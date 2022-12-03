import { DesignerContext } from '../designer-context';
import { ControlBarView } from './control-bar-view';
import { HistoryController } from '../history-controller';
import { DesignerState } from '../designer-state';
import { DefinitionModifier } from '../definition-modifier';
import { WorkspaceController } from '../workspace/workspace-controller';

export class ControlBar {
	public static create(parent: HTMLElement, context: DesignerContext): ControlBar {
		const view = ControlBarView.create(parent, !!context.historyController);
		const bar = new ControlBar(view, context.state, context.workspaceController, context.historyController, context.definitionModifier);

		view.bindResetButtonClick(() => bar.onResetButtonClicked());
		view.bindZoomInButtonClick(() => bar.onZoomInButtonClicked());
		view.bindZoomOutButtonClick(() => bar.onZoomOutButtonClicked());
		view.bindMoveButtonClick(() => bar.onMoveButtonClicked());
		view.bindDeleteButtonClick(() => bar.onDeleteButtonClicked());
		context.state.onIsReadonlyChanged.subscribe(() => bar.onIsReadonlyChanged());
		context.state.onSelectedStepChanged.subscribe(() => bar.onSelectedStepChanged());
		context.state.onIsMoveModeEnabledChanged.subscribe(i => bar.onIsMoveModeEnabledChanged(i));

		if (context.historyController) {
			view.bindUndoButtonClick(() => bar.onUndoButtonClicked());
			view.bindRedoButtonClick(() => bar.onRedoButtonClicked());
			context.state.onDefinitionChanged.subscribe(() => bar.onDefinitionChanged());

			bar.refreshUndoRedoAvailability();
		}
		return bar;
	}

	private constructor(
		private readonly view: ControlBarView,
		private readonly state: DesignerState,
		private readonly workspaceController: WorkspaceController,
		private readonly historyController: HistoryController | undefined,
		private readonly definitionModifier: DefinitionModifier
	) {}

	private onResetButtonClicked() {
		this.workspaceController.resetViewPort();
	}

	private onZoomInButtonClicked() {
		this.workspaceController.zoom(true);
	}

	private onZoomOutButtonClicked() {
		this.workspaceController.zoom(false);
	}

	private onMoveButtonClicked() {
		this.state.toggleIsMoveModeEnabled();
		if (this.state.selectedStep) {
			this.state.setSelectedStep(null);
		}
	}

	private onUndoButtonClicked() {
		if (!this.state.isReadonly && this.historyController?.canUndo()) {
			this.historyController.undo();
		}
	}

	private onRedoButtonClicked() {
		if (!this.state.isReadonly && this.historyController?.canRedo()) {
			this.historyController.redo();
		}
	}

	private onDeleteButtonClicked() {
		if (!this.state.isReadonly && this.state.selectedStep) {
			this.definitionModifier.tryDelete(this.state.selectedStep);
		}
	}

	private onIsReadonlyChanged() {
		this.refreshDeleteButtonVisibility();
	}

	private onSelectedStepChanged() {
		this.refreshDeleteButtonVisibility();
	}

	private onIsMoveModeEnabledChanged(isEnabled: boolean) {
		this.view.setIsMoveButtonDisabled(!isEnabled);
	}

	private onDefinitionChanged() {
		this.refreshUndoRedoAvailability();
	}

	private refreshUndoRedoAvailability() {
		if (!this.historyController) {
			throw new Error('Undo/redo is disabled');
		}

		const canUndo = this.historyController.canUndo();
		const canRedo = this.historyController.canRedo();
		this.view.setUndoButtonDisabled(!canUndo);
		this.view.setRedoButtonDisabled(!canRedo);
	}

	private refreshDeleteButtonVisibility() {
		const isHidden = !this.state.selectedStep || this.state.isReadonly;
		this.view.setIsDeleteButtonHidden(isHidden);
	}
}
