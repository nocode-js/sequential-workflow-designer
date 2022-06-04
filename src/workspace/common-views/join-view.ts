import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';

export class JoinView {

	public static createStraightJoin(parent: SVGElement, start: Vector, height: number) {
		const join = Dom.svg('line', {
			class: 'sqd-join',
			x1: start.x,
			y1: start.y,
			x2: start.x,
			y2: start.y + height
		});
		parent.insertBefore(join, parent.firstChild);
	}

	public static createJoins(parent: SVGElement, start: Vector, targets: Vector[]) {
		for (const target of targets) {
			const c = Math.abs(start.y - target.y) / 2; // size of a corner
			const l = Math.abs(start.x - target.x) - c * 2; // size of the line between corners

			const x = (start.x > target.x) ? -1 : 1;
			const y = (start.y > target.y) ? -1 : 1;

			const join = Dom.svg('path', {
				class: 'sqd-join',
				fill: 'none',
				d: `M ${start.x} ${start.y} q ${x * c * 0.3} ${y * c * 0.8} ${x * c} ${y * c} l ${x * l} 0 q ${x * c * 0.7} ${y * c * 0.2} ${x * c} ${y * c}`
			});
			parent.insertBefore(join, parent.firstChild);
		}
	}
}
