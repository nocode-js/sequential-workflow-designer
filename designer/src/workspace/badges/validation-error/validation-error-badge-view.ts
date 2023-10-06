import { Icons } from '../../../core';
import { Dom } from '../../../core/dom';
import { BadgeView } from '../../component';
import { ValidationErrorBadgeViewConfiguration } from './validation-error-badge-view-configuration';

export class ValidationErrorBadgeView implements BadgeView {
	public static create(parent: SVGElement, cfg: ValidationErrorBadgeViewConfiguration): ValidationErrorBadgeView {
		const g = Dom.svg('g');

		const halfOfSize = cfg.size / 2;
		const circle = Dom.svg('path', {
			class: 'sqd-validation-error',
			d: `M 0 ${-halfOfSize} l ${halfOfSize} ${cfg.size} l ${-cfg.size} 0 Z`
		});
		Dom.translate(circle, halfOfSize, halfOfSize);
		g.appendChild(circle);

		const icon = Icons.appendPath(g, 'sqd-validation-error-icon-path', Icons.alert, cfg.iconSize);
		const offsetX = (cfg.size - cfg.iconSize) / 2;
		const offsetY = offsetX * 1.5;
		Dom.translate(icon, offsetX, offsetY);

		parent.appendChild(g);
		return new ValidationErrorBadgeView(parent, g, cfg.size, cfg.size);
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
