import { Vector } from '../core';
import { ViewPort } from '../designer-state';
import { ComponentView } from './component';

const SCALES = [0.06, 0.08, 0.1, 0.12, 0.16, 0.2, 0.26, 0.32, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

function nextScale(scale: number, direction: boolean): number {
	const distances = SCALES.map((s, index) => ({
		distance: Math.abs(s - scale),
		index
	}));
	distances.sort((a, b) => a.distance - b.distance);
	let index = distances[0].index;
	if (direction) {
		index = Math.min(index + 1, SCALES.length - 1);
	} else {
		index = Math.max(index - 1, 0);
	}
	return SCALES[index];
}

const CENTER_MARGIN = 10;

export class ViewPortCalculator {
	public static center(clientCanvasSize: Vector, view: ComponentView): ViewPort {
		const canvasSafeWidth = Math.max(clientCanvasSize.x - CENTER_MARGIN * 2, 0);
		const canvasSafeHeight = Math.max(clientCanvasSize.y - CENTER_MARGIN * 2, 0);

		const scale = Math.min(Math.min(canvasSafeWidth / view.width, canvasSafeHeight / view.height), 1);
		const width = view.width * scale;
		const height = view.height * scale;

		const x = Math.max(0, (clientCanvasSize.x - width) / 2);
		const y = Math.max(0, (clientCanvasSize.y - height) / 2);

		return {
			position: new Vector(x, y),
			scale
		};
	}

	public static zoom(current: ViewPort, direction: boolean): ViewPort {
		const scale = nextScale(current.scale, direction);
		return {
			position: current.position,
			scale
		};
	}

	public static zoomByWheel(current: ViewPort, e: WheelEvent, clientPosition: Vector): ViewPort {
		const mousePoint = new Vector(e.pageX, e.pageY).subtract(clientPosition);
		// The real point is point on canvas with no scale.
		const mouseRealPoint = mousePoint.divideByScalar(current.scale).subtract(current.position.divideByScalar(current.scale));

		const scale = nextScale(current.scale, e.deltaY < 0);

		const position = mouseRealPoint.multiplyByScalar(-scale).add(mousePoint);
		return { position, scale };
	}
}
