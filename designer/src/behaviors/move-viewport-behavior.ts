import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { StateModifier } from '../modifier/state-modifier';
import { Behavior } from './behavior';

export class MoveViewportBehavior implements Behavior {
	public static create(resetSelectedStep: boolean, context: DesignerContext): MoveViewportBehavior {
		return new MoveViewportBehavior(context.state.viewport.position, resetSelectedStep, context.state, context.stateModifier);
	}

	private constructor(
		private readonly startPosition: Vector,
		private readonly resetSelectedStep: boolean,
		private readonly state: DesignerState,
		private readonly stateModifier: StateModifier
	) {}

	public onStart() {
		if (this.resetSelectedStep) {
			const stepIdOrNull = this.state.tryGetLastStepIdFromFolderPath();
			if (stepIdOrNull) {
				this.stateModifier.trySelectStepById(stepIdOrNull);
			} else {
				this.state.setSelectedStepId(null);
			}
		}
	}

	public onMove(delta: Vector) {
		this.state.setViewport({
			position: this.startPosition.subtract(delta),
			scale: this.state.viewport.scale
		});
	}

	public onEnd() {
		// Nothing to do.
	}
}
