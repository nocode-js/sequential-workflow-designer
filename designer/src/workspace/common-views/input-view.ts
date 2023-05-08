import { Dom } from '../../core/dom';

export class InputView {
	public static createRectInput(
		parent: SVGElement,
		x: number,
		y: number,
		size: number,
		iconSize: number,
		iconUrl: string | null
	): InputView {
		const g = Dom.svg('g');
		parent.appendChild(g);

		const rect = Dom.svg('rect', {
			class: 'sqd-input',
			width: size,
			height: size,
			x: x - size / 2,
			y: y + size / -2 + 0.5,
			rx: 4,
			ry: 4
		});
		g.appendChild(rect);

		if (iconUrl) {
			const icon = Dom.svg('image', {
				href: iconUrl,
				width: iconSize,
				height: iconSize,
				x: x - iconSize / 2,
				y: y + iconSize / -2
			});

			g.appendChild(icon);
		}
		return new InputView(g);
	}

	public static createRoundInput(parent: SVGElement, x: number, y: number, size: number) {
		const circle = Dom.svg('circle', {
			class: 'sqd-input',
			cx: x,
			xy: y,
			r: size / 2
		});
		parent.appendChild(circle);
		return new InputView(circle);
	}

	private constructor(private readonly root: SVGElement) {}

	public setIsHidden(isHidden: boolean) {
		Dom.attrs(this.root, {
			visibility: isHidden ? 'hidden' : 'visible'
		});
	}
}
