import { Vector } from '../core/vector';
import { Behavior, BehaviorEndToken } from './behavior';
import { readMousePosition, readTouchPosition } from '../core/event-readers';

const notInitializedError = 'State is not initialized';

const nonPassiveOptions: AddEventListenerOptions & EventListenerOptions = {
	passive: false
};

export class BehaviorController {
	public static create(shadowRoot: ShadowRoot | undefined) {
		return new BehaviorController(shadowRoot ?? document, shadowRoot);
	}

	private previousEndToken: BehaviorEndToken | null = null;
	private state: {
		startPosition: Vector;
		behavior: Behavior;
		lastPosition?: Vector;
	} | null = null;

	private constructor(
		private readonly dom: Document | ShadowRoot,
		private readonly shadowRoot: ShadowRoot | undefined
	) {}

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

		if (this.shadowRoot) {
			this.bind(this.shadowRoot);
		}
		this.bind(window);
	}

	private bind(target: EventTarget) {
		target.addEventListener('mousemove', this.onMouseMove, false);
		target.addEventListener('touchmove', this.onTouchMove, nonPassiveOptions);
		target.addEventListener('mouseup', this.onMouseUp, false);
		target.addEventListener('touchend', this.onTouchEnd, nonPassiveOptions);
		target.addEventListener('touchstart', this.onTouchStart, nonPassiveOptions);
	}

	private unbind(target: EventTarget) {
		target.removeEventListener('mousemove', this.onMouseMove, false);
		target.removeEventListener('touchmove', this.onTouchMove, nonPassiveOptions);
		target.removeEventListener('mouseup', this.onMouseUp, false);
		target.removeEventListener('touchend', this.onTouchEnd, nonPassiveOptions);
		target.removeEventListener('touchstart', this.onTouchStart, nonPassiveOptions);
	}

	private readonly onMouseMove = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		this.move(readMousePosition(e as MouseEvent));
	};

	private readonly onTouchMove = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		this.move(readTouchPosition(e as TouchEvent));
	};

	private readonly onMouseUp = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		this.stop(false, e.target as Element | null);
	};

	private readonly onTouchEnd = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		if (!this.state) {
			throw new Error(notInitializedError);
		}

		const position = this.state.lastPosition ?? this.state.startPosition;
		const element = this.dom.elementFromPoint(position.x, position.y);
		this.stop(false, element);
	};

	private readonly onTouchStart = (e: Event) => {
		e.preventDefault();
		e.stopPropagation();
		if ((e as TouchEvent).touches.length !== 1) {
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
			this.state.behavior.onEnd(true, null, null);

			this.state.behavior = newBehavior;
			this.state.startPosition = position;
			this.state.behavior.onStart(this.state.startPosition);
		}
	}

	private stop(interrupt: boolean, element: Element | null) {
		if (!this.state) {
			throw new Error(notInitializedError);
		}

		if (this.shadowRoot) {
			this.unbind(this.shadowRoot);
		}
		this.unbind(window);

		const endToken = this.state.behavior.onEnd(interrupt, element, this.previousEndToken);
		this.state = null;
		this.previousEndToken = endToken || null;
	}
}
