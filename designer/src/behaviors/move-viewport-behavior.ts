import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { DesignerState } from '../designer-state';
import { StateModifier } from '../modifier/state-modifier';
import { Behavior } from './behavior';

export class MoveViewportBehavior implements Behavior {
	public static create(resetSelectedStep: boolean, context: DesignerContext): MoveViewportBehavior {
		return new MoveViewportBehavior(context.state.viewport.position, resetSelectedStep, context.state, context.stateModifier);
	}

	private lastDelta?: Vector;

	private constructor(
		private readonly startPosition: Vector,
		private readonly resetSelectedStep: boolean,
		private readonly state: DesignerState,
		private readonly stateModifier: StateModifier
	) {}

	public onStart() {
		// Nothing to do.
	}

	public onMove(delta: Vector) {
		this.lastDelta = delta;

		this.state.setViewport({
			position: this.startPosition.subtract(delta),
			scale: this.state.viewport.scale
		});
	}

	public onEnd() {
		if (this.resetSelectedStep) {
			const distance = this.lastDelta ? this.lastDelta.distance() : 0;
			if (distance > 2) {
				return;
			}
			this.stateModifier.tryResetSelectedStep();
		}
	}
}
