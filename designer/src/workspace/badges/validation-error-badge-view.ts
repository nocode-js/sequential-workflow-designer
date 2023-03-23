import { Icons } from '../../core';
import { Dom } from '../../core/dom';
import { BadgeView } from '../component';

const SIZE = 22;
const ICON_SIZE = 12;

export class ValidationErrorBadgeView implements BadgeView {
	public static create(parent: SVGElement): ValidationErrorBadgeView {
		const g = Dom.svg('g');

		const halfOfSize = SIZE / 2;
		const circle = Dom.svg('path', {
			class: 'sqd-validation-error',
			d: `M 0 ${-halfOfSize} l ${halfOfSize} ${SIZE} l ${-SIZE} 0 Z`
		});
		Dom.translate(circle, halfOfSize, halfOfSize);
		g.appendChild(circle);

		const icon = Icons.appendPath(g, 'sqd-validation-error-icon-path', Icons.alert, ICON_SIZE);
		const offsetX = (SIZE - ICON_SIZE) * 0.5;
		const offsetY = offsetX * 1.5; // 0.5 * 1.5 = 0.75
		Dom.translate(icon, offsetX, offsetY);

		parent.appendChild(g);
		return new ValidationErrorBadgeView(parent, g, SIZE, SIZE);
	}

	public constructor(
		private readonly parent: SVGElement,
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number
	) {}

	public destroy() {
		this.parent.removeChild(this.g);
	}
}
