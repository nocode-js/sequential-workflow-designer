import { Icons } from '../../core';
import { Dom } from '../../core/dom';

const SIZE = 22;
const ICON_SIZE = 12;

export class ValidationErrorView {
	public static create(parent: SVGElement, x: number, y: number): ValidationErrorView {
		return new ValidationErrorView(parent, x, y);
	}

	private g?: SVGElement;

	public constructor(private readonly parent: SVGElement, private readonly x: number, private readonly y: number) {}

	public setIsHidden(isHidden: boolean) {
		if (isHidden) {
			if (this.g) {
				this.parent.removeChild(this.g);
				this.g = undefined;
			}
		} else if (!this.g) {
			this.g = Dom.svg('g');
			Dom.translate(this.g, this.x, this.y);

			const halfOfSize = SIZE / 2;
			const circle = Dom.svg('path', {
				class: 'sqd-validation-error',
				d: `M 0 ${-halfOfSize} l ${halfOfSize} ${SIZE} l ${-SIZE} 0 Z`
			});
			this.g.appendChild(circle);

			const icon = Icons.appendPath(this.g, 'sqd-validation-error-icon-path', Icons.alert, ICON_SIZE);
			const offsetX = (SIZE - ICON_SIZE) * 0.5;
			const offsetY = offsetX * 1.5; // 0.5 * 1.5 = 0.75
			Dom.translate(icon, -halfOfSize + offsetX, -halfOfSize + offsetY);

			this.parent.appendChild(this.g);
		}
	}
}
