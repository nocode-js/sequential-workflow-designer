import { Vector } from '../core/vector';
import { Behavior } from './behavior';
import { readMousePosition, readTouchPosition } from '../core/event-readers';

const notInitializedError = 'State is not initialized';

const nonPassiveOptions: AddEventListenerOptions & EventListenerOptions = {
	passive: false
};

export class BehaviorController {
	private state?: {
		startPosition: Vector;
		behavior: Behavior;
		lastPosition?: Vector;
	};

	public start(startPosition: Vector, behavior: Behavior) {
		if (this.state) {
			this.stop(true, null);
			return;
		}

		this.state = {
			startPosition,
			behavior
		};
		behavior.onStart(this.state.startPosition);

		window.addEventListener('mousemove', this.onMouseMove, false);
		window.addEventListener('touchmove', this.onTouchMove, nonPassiveOptions);
		window.addEventListener('mouseup', this.onMouseUp, false);
		window.addEventListener('touchend', this.onTouchEnd, nonPassiveOptions);
		window.addEventListener('touchstart', this.onTouchStart, nonPassiveOptions);
	}

	private readonly onMouseMove = (e: MouseEvent) => {
		e.preventDefault();
		this.move(readMousePosition(e));
	};

	private readonly onTouchMove = (e: TouchEvent) => {
		e.preventDefault();
		this.move(readTouchPosition(e));
	};

	private readonly onMouseUp = (e: MouseEvent) => {
		e.preventDefault();
		this.stop(false, e.target as Element | null);
	};

	private readonly onTouchEnd = (e: TouchEvent) => {
		e.preventDefault();
		if (!this.state) {
			throw new Error(notInitializedError);
		}

		const position = this.state.lastPosition ?? this.state.startPosition;
		const element = document.elementFromPoint(position.x, position.y);
		this.stop(false, element);
	};

	private readonly onTouchStart = (e: TouchEvent) => {
		e.preventDefault();
		if (e.touches.length !== 1) {
			this.stop(true, null);
		}
	};

	private move(position: Vector) {
		if (!this.state) {
			throw new Error(notInitializedError);
		}

		this.state.lastPosition = position;

		const delta = this.state.startPosition.subtract(position);
		const newBehavior = this.state.behavior.onMove(delta);
		if (newBehavior) {
			this.state.behavior.onEnd(true, null);

			this.state.behavior = newBehavior;
			this.state.startPosition = position;
			this.state.behavior.onStart(this.state.startPosition);
		}
	}

	private stop(interrupt: boolean, element: Element | null) {
		if (!this.state) {
			throw new Error(notInitializedError);
		}

		window.removeEventListener('mousemove', this.onMouseMove, false);
		window.removeEventListener('touchmove', this.onTouchMove, nonPassiveOptions);
		window.removeEventListener('mouseup', this.onMouseUp, false);
		window.removeEventListener('touchend', this.onTouchEnd, nonPassiveOptions);
		window.removeEventListener('touchstart', this.onTouchStart, nonPassiveOptions);

		this.state.behavior.onEnd(interrupt, element);
		this.state = undefined;
	}
}
