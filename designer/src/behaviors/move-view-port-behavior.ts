import { Vector } from '../core/vector';
import { DesignerState } from '../designer-state';
import { Behavior } from './behavior';

export class MoveViewPortBehavior implements Behavior {
	public static create(state: DesignerState, resetSelectedStep: boolean): MoveViewPortBehavior {
		return new MoveViewPortBehavior(state.viewPort.position, resetSelectedStep, state);
	}

	private constructor(
		private readonly startPosition: Vector,
		private readonly resetSelectedStep: boolean,
		private readonly state: DesignerState
	) {}

	public onStart() {
		if (this.resetSelectedStep) {
			const stepId = this.state.tryGetLastStepIdFromFolderPath();
			this.state.setSelectedStepId(stepId);
		}
	}

	public onMove(delta: Vector) {
		this.state.setViewPort({
			position: this.startPosition.subtract(delta),
			scale: this.state.viewPort.scale
		});
	}

	public onEnd() {
		// Nothing to do.
	}
}
