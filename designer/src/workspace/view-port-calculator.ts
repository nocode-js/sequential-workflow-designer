import { Vector } from '../core';
import { ViewPort } from '../designer-state';
import { ComponentView } from './component';

const MIN_SCALE = 0.05;
const MAX_SCALE = 3;
const ZOOM_DELTA = 0.2;
const WHEEL_DELTA = 0.1;

function getWheelDelta(e: WheelEvent): number {
	return e.deltaY > 0 ? -WHEEL_DELTA : WHEEL_DELTA;
}

function getZoomDelta(direction: boolean): number {
	return direction ? ZOOM_DELTA : -ZOOM_DELTA;
}

function limitScale(scale: number): number {
	return Math.min(Math.max(scale, MIN_SCALE), MAX_SCALE);
}

export class ViewPortCalculator {
	public static center(clientCanvasSize: Vector, view: ComponentView): ViewPort {
		const x = Math.max(0, (clientCanvasSize.x - view.width) / 2);
		const y = Math.max(0, (clientCanvasSize.y - view.height) / 2);

		return {
			position: new Vector(x, y),
			scale: 1
		};
	}

	public static zoom(current: ViewPort, direction: boolean): ViewPort {
		const delta = getZoomDelta(direction);
		const scale = limitScale(current.scale + delta);
		return {
			position: current.position,
			scale
		};
	}

	public static zoomByWheel(current: ViewPort, e: WheelEvent, clientPosition: Vector): ViewPort {
		const mousePoint = new Vector(e.pageX, e.pageY).subtract(clientPosition);
		// The real point is point on canvas with no scale.
		const mouseRealPoint = mousePoint.divideByScalar(current.scale).subtract(current.position.divideByScalar(current.scale));

		const wheelDelta = getWheelDelta(e);
		const newScale = limitScale(current.scale + wheelDelta);

		const position = mouseRealPoint.multiplyByScalar(-newScale).add(mousePoint);
		const scale = newScale;
		return { position, scale };
	}
}
