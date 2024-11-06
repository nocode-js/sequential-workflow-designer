import { Vector } from '../../core';
import { Viewport, ViewportController } from '../../designer-extension';

export class ZoomByWheelCalculator {
	public static calculate(
		controller: Pick<ViewportController, 'getNextScale' | 'smoothDeltaYLimit'>,
		current: Viewport,
		canvasPosition: Vector,
		e: WheelEvent
	): Viewport | null {
		if (e.deltaY === 0) {
			return null;
		}

		const nextScale = controller.getNextScale(current.scale, e.deltaY < 0);

		let scale: number;
		const absDeltaY = Math.abs(e.deltaY);
		if (absDeltaY < controller.smoothDeltaYLimit) {
			const fraction = absDeltaY / controller.smoothDeltaYLimit;
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
