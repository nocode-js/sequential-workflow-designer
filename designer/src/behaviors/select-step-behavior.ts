import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { StateModifier } from '../modifier/state-modifier';
import { StepComponent } from '../workspace/step-component';
import { Behavior } from './behavior';
import { DragStepBehavior } from './drag-step-behavior';
import { MoveViewportBehavior } from './move-viewport-behavior';
import { SelectStepBehaviorEndToken } from './select-step-behavior-end-token';

export class SelectStepBehavior implements Behavior {
	public static create(pressedStepComponent: StepComponent, forceMove: boolean, context: DesignerContext): SelectStepBehavior {
		const isDragDisabled =
			forceMove ||
			context.state.isDragDisabled ||
			!context.stateModifier.isDraggable(pressedStepComponent.step, pressedStepComponent.parentSequence);
		return new SelectStepBehavior(pressedStepComponent, isDragDisabled, context.state, context.stateModifier, context);
	}

	private constructor(
		private readonly pressedStepComponent: StepComponent,
		private readonly isDragDisabled: boolean,
		private readonly state: DesignerState,
		private readonly stateModifier: StateModifier,
		private readonly context: DesignerContext
	) {}

	public onStart() {
		// Nothing to do.
	}

	public onMove(delta: Vector): Behavior | void {
		if (delta.distance() > 2) {
			const canDrag = !this.state.isReadonly && !this.isDragDisabled;
			if (canDrag) {
				this.stateModifier.tryResetSelectedStep();
				return DragStepBehavior.create(this.context, this.pressedStepComponent.step, this.pressedStepComponent);
			} else {
				return MoveViewportBehavior.create(false, this.context);
			}
		}
	}

	public onEnd(interrupt: boolean): SelectStepBehaviorEndToken | void {
		if (interrupt) {
			return;
		}

		if (this.stateModifier.isSelectable(this.pressedStepComponent.step, this.pressedStepComponent.parentSequence)) {
			this.stateModifier.trySelectStepById(this.pressedStepComponent.step.id);
		} else {
			// If the step is not selectable, we try to reset the selection.
			this.stateModifier.tryResetSelectedStep();
		}
		return new SelectStepBehaviorEndToken(this.pressedStepComponent.step.id, Date.now());
	}
}
