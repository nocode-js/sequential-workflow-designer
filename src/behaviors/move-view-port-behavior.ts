import { Vector } from '../core/vector';
import { Workspace } from '../workspace/workspace';
import { Behavior } from './behavior';

export class MoveViewPortBehavior implements Behavior {

	public static create(startPosition: Vector, workspace: Workspace): MoveViewPortBehavior {
		return new MoveViewPortBehavior(startPosition, workspace);
	}

	private constructor(
		private readonly startPosition: Vector,
		private readonly workspace: Workspace) {
	}

	public onStart() {
		this.workspace.clearSelectedStep();
	}

	public onMove(delta: Vector) {
		const newPosition = this.startPosition.subtract(delta);
		this.workspace.setPosition(newPosition);
	}

	public onEnd() {
	}
}
