import { Dom } from '../../core';
import { Icons } from '../../core/icons';

const ICON_SIZE = 16;

export enum RectPlaceholderDirection {
	in = 1,
	out = 2
}

export class RectPlaceholderView {
	public static create(
		parent: SVGElement,
		x: number,
		y: number,
		width: number,
		height: number,
		direction?: RectPlaceholderDirection
	): RectPlaceholderView {
		const g = Dom.svg('g', {
			visibility: 'hidden',
			class: 'sqd-placeholder'
		});
		Dom.translate(g, x, y);
		parent.appendChild(g);

		const rect = Dom.svg('rect', {
			class: 'sqd-placeholder-rect',
			width,
			height,
			rx: 6,
			ry: 6
		});
		g.appendChild(rect);

		if (direction) {
			const iconD = direction === RectPlaceholderDirection.in ? Icons.folderIn : Icons.folderOut;
			const icon = Icons.appendPath(g, 'sqd-placeholder-icon-path', iconD, ICON_SIZE);
			Dom.translate(icon, (width - ICON_SIZE) / 2, (height - ICON_SIZE) / 2);
		}

		parent.appendChild(g);
		return new RectPlaceholderView(rect, g);
	}

	private constructor(public readonly rect: SVGElement, public readonly g: SVGElement) {}

	public setIsHover(isHover: boolean) {
		Dom.toggleClass(this.g, isHover, 'sqd-hover');
	}

	public setIsVisible(isVisible: boolean) {
		Dom.attrs(this.g, {
			visibility: isVisible ? 'visible' : 'hidden'
		});
	}
}
