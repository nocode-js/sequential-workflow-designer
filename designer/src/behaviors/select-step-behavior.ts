import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { StepComponent } from '../workspace/step-component';
import { Behavior } from './behavior';
import { DragStepBehavior } from './drag-step-behavior';
import { MoveViewportBehavior } from './move-viewport-behavior';

export class SelectStepBehavior implements Behavior {
	public static create(pressedStepComponent: StepComponent, isMiddleButton: boolean, context: DesignerContext): SelectStepBehavior {
		const isDragDisabled =
			isMiddleButton ||
			context.state.isDragDisabled ||
			!context.definitionModifier.isDraggable(pressedStepComponent.step, pressedStepComponent.parentSequence);
		return new SelectStepBehavior(pressedStepComponent, isDragDisabled, context, context.state);
	}

	private constructor(
		private readonly pressedStepComponent: StepComponent,
		private readonly isDragDisabled: boolean,
		private readonly context: DesignerContext,
		private readonly state: DesignerState
	) {}

	public onStart() {
		// Nothing to do.
	}

	public onMove(delta: Vector): Behavior | void {
		if (delta.distance() > 2) {
			const canDrag = !this.state.isReadonly && !this.isDragDisabled;
			if (canDrag) {
				this.state.setSelectedStepId(null);
				return DragStepBehavior.create(this.context, this.pressedStepComponent.step, this.pressedStepComponent);
			} else {
				return MoveViewportBehavior.create(this.state, false);
			}
		}
	}

	public onEnd(interrupt: boolean) {
		if (!interrupt) {
			this.state.setSelectedStepId(this.pressedStepComponent.step.id);
		}
	}
}
