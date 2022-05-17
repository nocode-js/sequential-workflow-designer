import { createSvgElement } from '../svg';
import { Vector } from '../vector';

export class ConnectionRenderer {

	public static createLine(layer: SVGElement, start: Vector, height: number) {
		const path = createSvgElement('line', {
			'stroke-width': 2,
			stroke: '#000',
			x1: start.x,
			y1: start.y,
			x2: start.x,
			y2: start.y + height
		});

		layer.appendChild(path);
	}

	public static createJoin(layer: SVGElement, start: Vector, targets: Vector[]) {
		for (const target of targets) {
			const h = Math.abs(start.y - target.y) / 2;
			const w = Math.abs(start.x - target.x) - h * 2;
			const dirX = start.x > target.x ? -1 : 1;
			const dirY = start.y > target.y ? -1 : 1;
			const path = createSvgElement('path', {
				'stroke-width': 2,
				stroke: '#000',
				fill: 'none',
				d: `M ${start.x} ${start.y} q ${dirX * h * 0.3} ${dirY * h * 0.8} ${dirX * h} ${dirY * h} l ${dirX * w} 0 q ${dirX * h * 0.7} ${dirY * h * 0.2} ${dirX * h} ${dirY * h} `
			});
			layer.appendChild(path);
		}
	}
}
