import { Vector } from '../core/vector';
import { Behavior } from './behavior';
import { readMousePosition, readTouchPosition } from '../core/event-readers';

export class BehaviorController {
	private readonly onMouseMoveHandler = (e: MouseEvent) => this.onMouseMove(e);
	private readonly onMouseUpHandler = (e: MouseEvent) => this.onMouseUp(e);
	private readonly onTouchMoveHandler = (e: TouchEvent) => this.onTouchMove(e);
	private readonly onTouchEndHandler = (e: TouchEvent) => this.onTouchEnd(e);
	private readonly onTouchStartHandler = (e: TouchEvent) => this.onTouchStart(e);

	private state?: {
		startPosition: Vector;
		behavior: Behavior;
	};

	public start(startPosition: Vector, behavior: Behavior) {
		if (this.state) {
			this.stop(true);
			return;
		}

		this.state = {
			startPosition,
			behavior
		};
		behavior.onStart(this.state.startPosition);

		window.addEventListener('mousemove', this.onMouseMoveHandler, false);
		window.addEventListener('touchmove', this.onTouchMoveHandler, false);
		window.addEventListener('mouseup', this.onMouseUpHandler, false);
		window.addEventListener('touchend', this.onTouchEndHandler, false);
		window.addEventListener('touchstart', this.onTouchStartHandler, false);
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
		this.stop(false);
	}

	private onTouchEnd(e: TouchEvent) {
		e.preventDefault();
		this.stop(false);
	}

	private onTouchStart(e: TouchEvent) {
		e.preventDefault();
		if (e.touches.length !== 1) {
			this.stop(true);
		}
	}

	private move(position: Vector) {
		if (!this.state) {
			throw new Error('State is empty');
		}

		const delta = this.state.startPosition.subtract(position);

		const newBehavior = this.state.behavior.onMove(delta);
		if (newBehavior) {
			this.state.behavior.onEnd(true);

			this.state.behavior = newBehavior;
			this.state.startPosition = position;
			this.state.behavior.onStart(this.state.startPosition);
		}
	}

	private stop(interrupt: boolean) {
		if (!this.state) {
			throw new Error('State is empty');
		}

		window.removeEventListener('mousemove', this.onMouseMoveHandler, false);
		window.removeEventListener('touchmove', this.onTouchMoveHandler, false);
		window.removeEventListener('mouseup', this.onMouseUpHandler, false);
		window.removeEventListener('touchend', this.onTouchEndHandler, false);
		window.removeEventListener('touchstart', this.onTouchEndHandler, false);

		this.state.behavior.onEnd(interrupt);
		this.state = undefined;
	}
}
