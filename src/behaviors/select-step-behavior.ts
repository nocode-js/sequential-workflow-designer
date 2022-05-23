import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { StepComponent } from '../workspace/component';
import { Behavior } from './behavior';
import { DragStepBehavior } from './drag-step-behavior';

export class SelectStepBehavior implements Behavior {

	public static create(pressedStepComponent: StepComponent, context: DesignerContext): SelectStepBehavior {
		return new SelectStepBehavior(
			pressedStepComponent,
			context);
	}

	private isCanceled = false;

	private constructor(
		private readonly pressedStepComponent: StepComponent,
		private readonly context: DesignerContext) {
	}

	public onStart() {
	}

	public onMove(delta: Vector): Behavior | void {
		if (delta.distance() > 2) {
			this.isCanceled = true;
			this.context.setSelectedStepComponent(null);
			return DragStepBehavior.create(this.context, this.pressedStepComponent.step, this.pressedStepComponent);
		}
	}

	public onEnd() {
		if (!this.isCanceled) {
			this.context.setSelectedStepComponent(this.pressedStepComponent);
		}
	}
}
