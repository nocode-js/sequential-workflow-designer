import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { Behavior } from './behavior';

export class MoveViewPortBehavior implements Behavior {

	public static create(context: DesignerContext): MoveViewPortBehavior {
		return new MoveViewPortBehavior(
			context.viewPort.position,
			context);
	}

	private constructor(
		private readonly startPosition: Vector,
		private readonly context: DesignerContext) {
	}

	public onStart() {
		this.context.setSelectedStep(null);
	}

	public onMove(delta: Vector) {
		const newPosition = this.startPosition.subtract(delta);
		this.context.setViewPort(newPosition, this.context.viewPort.scale);
	}

	public onEnd() {
	}
}
