import { Vector } from '../core/vector';
import { Behavior } from './behavior';

export class BehaviorController {

	public static create(): BehaviorController {
		return new BehaviorController();
	}

	private readonly onMouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
	private readonly onMouseUpHandler = (e: MouseEvent) => this.onMouseUp(e);

	private state?: {
		startMousePosition: Vector;
		behavior: Behavior;
	};

	public start(e: MouseEvent, behavior: Behavior) {
		if (this.state) {
			this.onMouseUp(e);
			return;
		}
		e.preventDefault();

		this.state = {
			startMousePosition: readMousePosition(e),
			behavior: behavior
		};
		behavior.onStart(this.state.startMousePosition);

		window.addEventListener('mousemove', this.onMouseMoveHandler);
		window.addEventListener('mouseup', this.onMouseUpHandler);
	}

	private onMouseMove(e: MouseEvent) {
		e.preventDefault();
		if (this.state) {
			const delta = this.state.startMousePosition.subtract(readMousePosition(e));

			const newBehavior = this.state.behavior.onMove(delta);
			if (newBehavior) {
				this.state.behavior.onEnd();

				this.state.behavior = newBehavior;
				this.state.startMousePosition = readMousePosition(e);
				this.state.behavior.onStart(this.state.startMousePosition);
			}
		}
	}

	private onMouseUp(e: MouseEvent) {
		e.preventDefault();
		if (this.state) {
			this.state.behavior.onEnd();
			this.state = undefined;
		}
	}
}

function readMousePosition(e: MouseEvent) {
	return new Vector(e.clientX, e.clientY);
}
