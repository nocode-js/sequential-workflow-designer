import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { StepComponent } from '../workspace/component';
import { ComponentContext } from '../workspace/component-context';
import { Behavior } from './behavior';
import { DragStepBehavior } from './drag-step-behavior';

export class SelectStepBehavior implements Behavior {
	public static create(
		pressedStepComponent: StepComponent,
		designerContext: DesignerContext,
		componentContext: ComponentContext
	): SelectStepBehavior {
		return new SelectStepBehavior(pressedStepComponent, designerContext, componentContext, designerContext.state);
	}

	private constructor(
		private readonly pressedStepComponent: StepComponent,
		private readonly designerContext: DesignerContext,
		private readonly componentContext: ComponentContext,
		private readonly state: DesignerState
	) {}

	public onStart() {
		// Nothing to do.
	}

	public onMove(delta: Vector): Behavior | void {
		if (!this.state.isReadonly && delta.distance() > 2) {
			this.state.setSelectedStep(null);
			return DragStepBehavior.create(
				this.designerContext,
				this.componentContext,
				this.pressedStepComponent.step,
				this.pressedStepComponent
			);
		}
	}

	public onEnd(interrupt: boolean) {
		if (!interrupt) {
			this.state.setSelectedStep(this.pressedStepComponent.step);
		}
	}
}
