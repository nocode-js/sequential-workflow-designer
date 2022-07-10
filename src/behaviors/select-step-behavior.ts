import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { StepComponent } from '../workspace/component';
import { Behavior } from './behavior';
import { DragStepBehavior } from './drag-step-behavior';

export class SelectStepBehavior implements Behavior {
	public static create(pressedStepComponent: StepComponent, context: DesignerContext): SelectStepBehavior {
		return new SelectStepBehavior(pressedStepComponent, context);
	}

	private constructor(private readonly pressedStepComponent: StepComponent, private readonly context: DesignerContext) {}

	public onStart() {
		// Nothing to do.
	}

	public onMove(delta: Vector): Behavior | void {
		if (!this.context.isReadonly && delta.distance() > 2) {
			this.context.setSelectedStep(null);
			return DragStepBehavior.create(this.context, this.pressedStepComponent.step, this.pressedStepComponent);
		}
	}

	public onEnd(interrupt: boolean) {
		if (!interrupt) {
			this.context.setSelectedStep(this.pressedStepComponent.step);
		}
	}
}
