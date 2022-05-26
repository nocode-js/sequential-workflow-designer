import { Vector } from '../core/vector';
import { Behavior } from './behavior';
import { readMousePosition, readTouchPosition } from '../core/event-readers';

export class BehaviorController {

	private readonly onMouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
	private readonly onTouchMoveHandler = (e: TouchEvent) => this.onTouchMove(e);
	private readonly onMouseUpHandler = (e: MouseEvent) => this.onMouseUp(e);
	private readonly onTouchEndHandler = (e: TouchEvent) => this.onTouchEnd(e);

	private state?: {
		startPosition: Vector;
		behavior: Behavior;
	};

	public start(startPosition: Vector, behavior: Behavior) {
		if (this.state) {
			this.stop();
			return;
		}

		this.state = {
			startPosition,
			behavior
		};
		behavior.onStart(this.state.startPosition);

		window.addEventListener('mousemove', this.onMouseMoveHandler);
		window.addEventListener('touchmove', this.onTouchMoveHandler);
		window.addEventListener('mouseup', this.onMouseUpHandler);
		window.addEventListener('touchend', this.onTouchEndHandler);
	}

	private onMouseMove(e: MouseEvent) {
		e.preventDefault();
		this.move(readMousePosition(e));
	}

	private onTouchMove(e: TouchEvent) {
		e.preventDefault();
		this.move(readTouchPosition(e));
	}

	private onMouseUp(e: MouseEvent) {
		e.preventDefault();
		this.stop();
	}

	private onTouchEnd(e: TouchEvent) {
		e.preventDefault();
		this.stop();
	}

	private move(position: Vector) {
		if (this.state) {
			const delta = this.state.startPosition.subtract(position);

			const newBehavior = this.state.behavior.onMove(delta);
			if (newBehavior) {
				this.state.behavior.onEnd();

				this.state.behavior = newBehavior;
				this.state.startPosition = position;
				this.state.behavior.onStart(this.state.startPosition);
			}
		}
	}

	private stop() {
		if (this.state) {
			this.state.behavior.onEnd();
			this.state = undefined;
		}
	}
}
