import { Vector } from '../core/vector';
import { StepComponent } from '../workspace/component';
import { Workspace } from '../workspace/workspace';
import { Behavior } from './behavior';
import { DragStepBehavior } from './drag-step-behavior';

export class SelectStepBehavior implements Behavior {

	public static create(pressedStepComponent: StepComponent, workspace: Workspace): SelectStepBehavior {
		return new SelectStepBehavior(pressedStepComponent, workspace);
	}

	private isCanceled = false;

	private constructor(
		private readonly pressedStepComponent: StepComponent,
		private readonly workspace: Workspace) {
	}

	public onStart() {
	}

	public onMove(delta: Vector): Behavior | void {
		if (delta.distance() > 2) {
			this.isCanceled = true;
			this.workspace.clearSelectedStep();
			return DragStepBehavior.create(this.workspace, this.pressedStepComponent.step, this.pressedStepComponent);
		}
	}

	public onEnd() {
		if (!this.isCanceled) {
			this.workspace.selectStep(this.pressedStepComponent);
		}
	}
}
