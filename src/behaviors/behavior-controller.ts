import { Vector } from '../core/vector';
import { Behavior } from './behavior';

export class BehaviorController {

	public static create(): BehaviorController {
		return new BehaviorController();
	}

	private readonly onMouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
	private readonly onMouseUpHandler = (e: MouseEvent) => this.onMouseUp(e);

	private current?: {
		startMousePosition: Vector;
		behavior: Behavior;
	};

	public start(e: MouseEvent, behavior: Behavior) {
		if (this.current) {
			this.onMouseUp(e);
			return;
		}
		e.preventDefault();

		this.current = {
			startMousePosition: readMousePosition(e),
			behavior: behavior
		};
		behavior.onStart(this.current.startMousePosition);

		window.addEventListener('mousemove', this.onMouseMoveHandler);
		window.addEventListener('mouseup', this.onMouseUpHandler);
	}

	public onMouseMove(e: MouseEvent) {
		e.preventDefault();
		if (this.current) {
			const delta = this.current.startMousePosition.subtract(readMousePosition(e));

			const newBehavior = this.current.behavior.onMove(delta);
			if (newBehavior) {
				this.current.behavior.onEnd(e.target as HTMLElement);

				this.current.behavior = newBehavior;
				this.current.startMousePosition = readMousePosition(e);
				this.current.behavior.onStart(this.current.startMousePosition);
			}
		}
	}

	public onMouseUp(e: MouseEvent) {
		e.preventDefault();
		if (this.current) {
			this.current.behavior.onEnd(e.target as Element);
			this.current = undefined;
		}
	}
}

function readMousePosition(e: MouseEvent) {
	return new Vector(e.clientX, e.clientY);
}
