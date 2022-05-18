import { Svg } from '../svg';
import { Vector } from '../vector';

export class JoinRenderer {

	public static appendStraightJoin(layer: SVGElement, start: Vector, height: number) {
		const join = Svg.element('line', {
			class: 'sqd-join',
			x1: start.x,
			y1: start.y,
			x2: start.x,
			y2: start.y + height
		});
		layer.appendChild(join);
	}

	public static appendJoins(layer: SVGElement, start: Vector, targets: Vector[]) {
		for (const target of targets) {
			const c = Math.abs(start.y - target.y) / 2; // size of a corner
			const l = Math.abs(start.x - target.x) - c * 2; // size of the line between corners

			const x = (start.x > target.x) ? -1 : 1;
			const y = (start.y > target.y) ? -1 : 1;

			const join = Svg.element('path', {
				class: 'sqd-join',
				fill: 'none',
				d: `M ${start.x} ${start.y} q ${x * c * 0.3} ${y * c * 0.8} ${x * c} ${y * c} l ${x * l} 0 q ${x * c * 0.7} ${y * c * 0.2} ${x * c} ${y * c}`
			});
			layer.appendChild(join);
		}
	}
}
