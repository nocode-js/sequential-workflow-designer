import { SequenceModifier } from '../core/sequence-modifier';
import { DesignerContext } from '../designer-context';
import { ControlBarView } from './control-bar-view';

export class ControlBar {

	public static create(parent: HTMLElement, context: DesignerContext): ControlBar {
		const view = ControlBarView.create(parent);
		const bar = new ControlBar(view, context);
		view.bindDeleteButtonClick(e => bar.onDeleteButtonClicked(e));
		view.bindMoveButtonClick(e => bar.onMoveButtonClicked(e));
		view.bindResetButtonClick(e => bar.onResetButtonClicked(e));
		context.onIsReadonlyChanged.subscribe(() => bar.onIsReadonlyChanged());
		context.onSelectedStepChanged.subscribe(() => bar.onSelectedStepChanged());
		context.onIsMoveModeEnabledChanged.subscribe(i => bar.onIsMoveModeEnabledChanged(i));
		return bar;
	}

	private constructor(
		private readonly view: ControlBarView,
		private readonly context: DesignerContext) {
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

	private onDeleteButtonClicked(e: Event) {
		e.preventDefault();
		if (this.context.selectedStep) {
			const parentSequence = this.context.getSelectedStepParentSequence();
			SequenceModifier.deleteStep(
				this.context.selectedStep,
				parentSequence);

			this.context.setSelectedStep(null);
			this.context.notifiyDefinitionChanged();
		}
	}

	private onResetButtonClicked(e: Event) {
		e.preventDefault();
		this.context.resetViewPort();
	}

	private onMoveButtonClicked(e: Event) {
		e.preventDefault();
		this.context.toggleIsMoveModeEnabled();
	}

	private refreshDeleteButtonVisibility() {
		const isHidden = !this.context.selectedStep || this.context.isReadonly;
		this.view.setIsDeleteButtonHidden(isHidden);
	}
}
