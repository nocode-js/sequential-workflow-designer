import { Dom } from '../core/dom';

const SIZE = 20;

export class ValidationErrorRenderer {

	public static create(parent: SVGElement, x: number, y: number): SVGElement {
		const g = Dom.svg('g', {
			class: 'sqd-hidden'
		});
		Dom.translate(g, x, y);

		const circle = Dom.svg('path', {
			class: 'sqd-validation-error',
			d: `M 0 ${-SIZE / 2} l ${SIZE / 2} ${SIZE} l ${-SIZE} 0 Z`
		});

		g.appendChild(circle);
		parent.appendChild(g);
		return g;
	}
}
