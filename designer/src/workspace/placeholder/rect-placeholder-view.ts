import { Dom } from '../../core';
import { Icons } from '../../core/icons';
import { PlaceholderDirection, PlaceholderView } from '../component';

export class RectPlaceholderView implements PlaceholderView {
	public static create(
		parent: SVGElement,
		width: number,
		height: number,
		radius: number,
		iconSize: number,
		direction: PlaceholderDirection
	): RectPlaceholderView {
		const g = Dom.svg('g', {
			visibility: 'hidden',
			class: 'sqd-placeholder'
		});
		parent.appendChild(g);

		const rect = Dom.svg('rect', {
			class: 'sqd-placeholder-rect',
			width,
			height,
			rx: radius,
			ry: radius
		});
		g.appendChild(rect);

		if (direction) {
			const iconD = direction === PlaceholderDirection.in ? Icons.folderIn : Icons.folderOut;
			const icon = Icons.appendPath(g, 'sqd-placeholder-icon-path', iconD, iconSize);
			Dom.translate(icon, (width - iconSize) / 2, (height - iconSize) / 2);
		}

		parent.appendChild(g);
		return new RectPlaceholderView(rect, g);
	}

	private constructor(public readonly rect: SVGElement, public readonly g: SVGGElement) {}

	public setIsHover(isHover: boolean) {
		Dom.toggleClass(this.g, isHover, 'sqd-hover');
	}

	public setIsVisible(isVisible: boolean) {
		Dom.attrs(this.g, {
			visibility: isVisible ? 'visible' : 'hidden'
		});
	}
}
