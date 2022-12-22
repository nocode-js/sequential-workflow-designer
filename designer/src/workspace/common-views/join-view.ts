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
		const firstTarget = targets[0];
		const h = Math.abs(firstTarget.y - start.y) / 2; // half height
		const y = Math.sign(firstTarget.y - start.y); // y direction

		switch (targets.length) {
			case 1:
				if (start.x === targets[0].x) {
					JoinView.createStraightJoin(parent, start, firstTarget.y * y);
				} else {
					appendCurvedJoins(parent, start, targets, h, y);
				}
				break;

			case 2:
				appendCurvedJoins(parent, start, targets, h, y);
				break;

			default:
				{
					const f = targets[0]; // first
					const l = targets[targets.length - 1]; // last
					appendJoin(
						parent,
						`M ${f.x} ${f.y} q ${h * 0.3} ${h * -y * 0.8} ${h} ${h * -y} ` +
							`l ${l.x - f.x - h * 2} 0 q ${h * 0.8} ${-h * -y * 0.3} ${h} ${-h * -y}`
					);

					for (let i = 1; i < targets.length - 1; i++) {
						JoinView.createStraightJoin(parent, targets[i], h * -y);
					}
					JoinView.createStraightJoin(parent, start, h * y);
				}
				break;
		}
	}
}

function appendCurvedJoins(parent: SVGElement, start: Vector, targets: Vector[], h: number, y: number) {
	for (const target of targets) {
		const l = Math.abs(target.x - start.x) - h * 2; // line size
		const x = Math.sign(target.x - start.x); // x direction

		appendJoin(
			parent,
			`M ${start.x} ${start.y} q ${x * h * 0.3} ${y * h * 0.8} ${x * h} ${y * h} ` +
				`l ${x * l} 0 q ${x * h * 0.7} ${y * h * 0.2} ${x * h} ${y * h}`
		);
	}
}

function appendJoin(parent: SVGElement, d: string) {
	const join = Dom.svg('path', {
		class: 'sqd-join',
		fill: 'none',
		d
	});
	parent.insertBefore(join, parent.firstChild);
}
