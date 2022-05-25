import { Dom } from '../core/dom';

const SIZE = 20;

export class ValidationErrorRenderer {

	public static append(g: SVGGElement, x: number, y: number): SVGElement {
		const circle = Dom.svg('path', {
			class: 'sqd-validation-error',
			d: `M ${x} ${y - SIZE / 2} l ${SIZE / 2} ${SIZE} l ${-SIZE} 0 Z`
		});
		g.appendChild(circle);
		return circle;
	}
}
