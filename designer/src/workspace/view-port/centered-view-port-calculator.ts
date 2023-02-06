import { Vector } from '../../core';
import { ViewPort } from '../../designer-state';
import { ComponentView } from '../component';

const CENTER_MARGIN = 10;

export class CenteredViewPortCalculator {
	public static calculate(clientCanvasSize: Vector, view: ComponentView): ViewPort {
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
}
