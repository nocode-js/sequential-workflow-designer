import { WorkspaceApi } from '../../api';
import { ViewportApi } from '../../api/viewport-api';
import { Vector } from '../../core';
import { readFingerCenterPoint, calculateFingerDistance } from '../../core/event-readers';
import { Viewport } from '../../designer-extension';

const nonPassiveOptions: AddEventListenerOptions & EventListenerOptions = {
	passive: false
};

const notInitializedError = 'State is not initialized';

export class PinchToZoomController {
	public static create(workspaceApi: WorkspaceApi, viewportApi: ViewportApi, shadowRoot: ShadowRoot | undefined) {
		return new PinchToZoomController(workspaceApi, viewportApi, shadowRoot);
	}

	private state: {
		canvasPosition: Vector;
		startScale: number;
		startDistance: number;
		lastViewport: Viewport;
		lastCenterPoint: Vector;
	} | null = null;

	private constructor(
		private readonly workspaceApi: WorkspaceApi,
		private readonly viewportApi: ViewportApi,
		private readonly shadowRoot: ShadowRoot | undefined
	) {}

	public start(startDistance: number, centerPoint: Vector) {
		if (this.state) {
			throw new Error(`State is already initialized`);
		}

		if (this.shadowRoot) {
			this.bind(this.shadowRoot);
		}
		this.bind(window);

		const viewport = this.workspaceApi.getViewport();
		this.state = {
			canvasPosition: this.workspaceApi.getCanvasPosition(),
			startScale: viewport.scale,
			startDistance,
			lastViewport: viewport,
			lastCenterPoint: centerPoint
		};
	}

	private bind(target: EventTarget) {
		target.addEventListener('touchmove', this.onTouchMove, nonPassiveOptions);
		target.addEventListener('touchend', this.onTouchEnd, nonPassiveOptions);
	}

	private unbind(target: EventTarget) {
		target.removeEventListener('touchmove', this.onTouchMove, nonPassiveOptions);
		target.removeEventListener('touchend', this.onTouchEnd, nonPassiveOptions);
	}

	private readonly onTouchMove = (e: Event) => {
		e.preventDefault();
		if (!this.state) {
			throw new Error(notInitializedError);
		}
		const touchEvent = e as TouchEvent;

		const distance = calculateFingerDistance(touchEvent);
		const centerPoint = readFingerCenterPoint(touchEvent);

		const deltaCenterPoint = centerPoint.subtract(this.state.lastCenterPoint);
		const scale = this.viewportApi.limitScale(this.state.startScale * (distance / this.state.startDistance));

		const zoomPoint = centerPoint.subtract(this.state.canvasPosition);
		const zoomRealPoint = zoomPoint
			.divideByScalar(this.state.lastViewport.scale)
			.subtract(this.state.lastViewport.position.divideByScalar(this.state.lastViewport.scale));

		const position = zoomRealPoint.multiplyByScalar(-scale).add(zoomPoint).add(deltaCenterPoint);

		const newViewport: Viewport = {
			position,
			scale
		};
		this.workspaceApi.setViewport(newViewport);

		this.state.lastCenterPoint = centerPoint;
		this.state.lastViewport = newViewport;
	};

	private readonly onTouchEnd = (e: Event) => {
		e.preventDefault();
		if (!this.state) {
			throw new Error(notInitializedError);
		}

		if (this.shadowRoot) {
			this.unbind(this.shadowRoot);
		}
		this.unbind(window);
		this.state = null;
	};
}
