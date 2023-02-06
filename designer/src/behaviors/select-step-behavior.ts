import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { StepComponent } from '../workspace/component';
import { Behavior } from './behavior';
import { DragStepBehavior } from './drag-step-behavior';
import { MoveViewPortBehavior } from './move-view-port-behavior';

export class SelectStepBehavior implements Behavior {
	public static create(
		pressedStepComponent: StepComponent,
		isDragDisabled: boolean,
		designerContext: DesignerContext
	): SelectStepBehavior {
		return new SelectStepBehavior(pressedStepComponent, isDragDisabled, designerContext, designerContext.state);
	}

	private constructor(
		private readonly pressedStepComponent: StepComponent,
		private readonly isDragDisabled: boolean,
		private readonly designerContext: DesignerContext,
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
				return DragStepBehavior.create(this.designerContext, this.pressedStepComponent.step, this.pressedStepComponent);
			} else {
				return MoveViewPortBehavior.create(this.state, false);
			}
		}
	}

	public onEnd(interrupt: boolean) {
		if (!interrupt) {
			this.state.setSelectedStepId(this.pressedStepComponent.step.id);
		}
	}
}
