import { Vector } from '../core/vector';
import { DesignerState } from '../designer-state';
import { Behavior } from './behavior';

export class MoveViewPortBehavior implements Behavior {
	public static create(state: DesignerState): MoveViewPortBehavior {
		return new MoveViewPortBehavior(state.viewPort.position, state);
	}

	private constructor(private readonly startPosition: Vector, private readonly state: DesignerState) {}

	public onStart() {
		const stepId = this.state.tryGetLastStepIdFromFolderPath();
		this.state.setSelectedStepId(stepId);
	}

	public onMove(delta: Vector) {
		const newPosition = this.startPosition.subtract(delta);
		this.state.setViewPort({
			position: newPosition,
			scale: this.state.viewPort.scale
		});
	}

	public onEnd() {
		// Nothing to do.
	}
}
