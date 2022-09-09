import { DesignerContext } from '../designer-context';
import { ControlBarView } from './control-bar-view';

export class ControlBar {
	public static create(parent: HTMLElement, context: DesignerContext): ControlBar {
		const view = ControlBarView.create(parent);
		const bar = new ControlBar(view, context);
		view.bindResetButtonClick(() => bar.onResetButtonClicked());
		view.bindZoomInButtonClick(() => bar.onZoomInButtonClicked());
		view.bindZoomOutButtonClick(() => bar.onZoomOutButtonClicked());
		view.bindMoveButtonClick(() => bar.onMoveButtonClicked());
		view.bindDeleteButtonClick(() => bar.onDeleteButtonClicked());
		context.onIsReadonlyChanged.subscribe(() => bar.onIsReadonlyChanged());
		context.onSelectedStepChanged.subscribe(() => bar.onSelectedStepChanged());
		context.onIsMoveModeEnabledChanged.subscribe(i => bar.onIsMoveModeEnabledChanged(i));
		return bar;
	}

	private constructor(private readonly view: ControlBarView, private readonly context: DesignerContext) {}

	private onResetButtonClicked() {
		this.context.resetViewPort();
	}

	private onZoomInButtonClicked() {
		this.context.zoom(true);
	}

	private onZoomOutButtonClicked() {
		this.context.zoom(false);
	}

	private onMoveButtonClicked() {
		this.context.toggleIsMoveModeEnabled();
		if (this.context.selectedStep) {
			this.context.setSelectedStep(null);
		}
	}

	private onDeleteButtonClicked() {
		if (this.context.selectedStep) {
			this.context.tryDeleteStep(this.context.selectedStep);
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

	private refreshDeleteButtonVisibility() {
		const isHidden = !this.context.selectedStep || this.context.isReadonly;
		this.view.setIsDeleteButtonHidden(isHidden);
	}
}
