import { Vector } from '../../core';
import { Viewport } from '../../designer-extension';
import { NextQuantifiedNumber } from './next-quantified-number';

const SCALES = [0.06, 0.08, 0.1, 0.12, 0.16, 0.2, 0.26, 0.32, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const MAX_DELTA_Y = 16;

const quantifiedScale = new NextQuantifiedNumber(SCALES);

export class QuantifiedScaleViewportCalculator {
	public static zoom(current: Viewport, direction: boolean): Viewport {
		const nextScale = quantifiedScale.next(current.scale, direction);
		return {
			position: current.position,
			scale: nextScale.next
		};
	}

	public static zoomByWheel(current: Viewport, e: WheelEvent, canvasPosition: Vector): Viewport | null {
		if (e.deltaY === 0) {
			return null;
		}

		const nextScale = quantifiedScale.next(current.scale, e.deltaY < 0);

		let scale: number;
		const absDeltaY = Math.abs(e.deltaY);
		if (absDeltaY < MAX_DELTA_Y) {
			const fraction = absDeltaY / MAX_DELTA_Y;
			const step = nextScale.next - nextScale.current;
			scale = current.scale + step * fraction;
		} else {
			scale = nextScale.next;
		}

		const mousePoint = new Vector(e.pageX, e.pageY).subtract(canvasPosition);
		// The real point is point on canvas with no scale.
		const mouseRealPoint = mousePoint.divideByScalar(current.scale).subtract(current.position.divideByScalar(current.scale));

		const position = mouseRealPoint.multiplyByScalar(-scale).add(mousePoint);
		return { position, scale };
	}
}
