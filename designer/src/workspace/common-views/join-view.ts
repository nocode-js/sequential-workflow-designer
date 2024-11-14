import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';

const EPS = 0.5; // Epsilon, a tiny offset to avoid rendering issues

export class JoinView {
	public static createStraightJoin(parent: SVGElement, start: Vector, height: number) {
		const dy = Math.sign(height);
		const join = Dom.svg('line', {
			class: 'sqd-join',
			x1: start.x,
			y1: start.y - EPS * dy,
			x2: start.x,
			y2: start.y + height + EPS * dy
		});
		parent.insertBefore(join, parent.firstChild);
	}

	public static createJoins(parent: SVGElement, start: Vector, targets: Vector[]) {
		const firstTarget = targets[0];
		const h = Math.abs(firstTarget.y - start.y) / 2; // half height
		const dy = Math.sign(firstTarget.y - start.y); // direction y

		switch (targets.length) {
			case 1:
				if (start.x === targets[0].x) {
					JoinView.createStraightJoin(parent, start, firstTarget.y * dy);
				} else {
					appendCurvedJoins(parent, start, targets, h, dy);
				}
				break;

			case 2:
				appendCurvedJoins(parent, start, targets, h, dy);
				break;

			default:
				{
					const f = targets[0]; // first
					const l = targets[targets.length - 1]; // last
					const eps = EPS * dy;
					appendJoin(
						parent,
						`M ${f.x} ${f.y + eps} l 0 ${-eps} q ${h * 0.3} ${h * -dy * 0.8} ${h} ${h * -dy} ` +
							`l ${l.x - f.x - h * 2} 0 q ${h * 0.8} ${-h * -dy * 0.3} ${h} ${-h * -dy} l 0 ${eps}`
					);

					for (let i = 1; i < targets.length - 1; i++) {
						JoinView.createStraightJoin(parent, targets[i], h * -dy);
					}
					JoinView.createStraightJoin(parent, start, h * dy);
				}
				break;
		}
	}
}

function appendCurvedJoins(parent: SVGElement, start: Vector, targets: Vector[], h: number, dy: number) {
	const eps = EPS * dy;
	for (const target of targets) {
		const l = Math.abs(target.x - start.x) - h * 2; // straight line length
		const dx = Math.sign(target.x - start.x); // direction x
		appendJoin(
			parent,
			`M ${start.x} ${start.y - eps} l 0 ${eps} q ${dx * h * 0.3} ${dy * h * 0.8} ${dx * h} ${dy * h} ` +
				`l ${dx * l} 0 q ${dx * h * 0.7} ${dy * h * 0.2} ${dx * h} ${dy * h} l 0 ${eps}`
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
