import { Vector } from '../core/vector';
import { DesignerContext } from '../designer-context';
import { Workspace } from '../workspace/workspace';
import { Behavior } from './behavior';

export class MoveViewPortBehavior implements Behavior {

	public static create(startPosition: Vector, workspace: Workspace, context: DesignerContext): MoveViewPortBehavior {
		return new MoveViewPortBehavior(
			startPosition,
			workspace,
			context);
	}

	private constructor(
		private readonly startPosition: Vector,
		private readonly workspace: Workspace,
		private readonly context: DesignerContext) {
	}

	public onStart() {
		this.context.setSelectedStepComponent(null);
	}

	public onMove(delta: Vector) {
		const newPosition = this.startPosition.subtract(delta);
		this.workspace.setPosition(newPosition);
	}

	public onEnd() {
	}
}
