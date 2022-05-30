import { Dom } from '../../core/dom';

const RECT_INPUT_SIZE = 18;
const RECT_INPUT_ICON_SIZE = 14;

const ROUND_INPUT_SIZE = 7;

export class InputView {

	public static addRectInput(parent: SVGElement, x: number, y: number, iconUrl: string | null): InputView {
		const g = Dom.svg('g');
		parent.appendChild(g);

		const rect = Dom.svg('rect', {
			class: 'sqd-input',
			width: RECT_INPUT_SIZE,
			height: RECT_INPUT_SIZE,
			x: x - RECT_INPUT_SIZE / 2,
			y: y + RECT_INPUT_SIZE / -2 + .5,
			rx: 4,
			ry: 4
		});
		g.appendChild(rect);

		if (iconUrl) {
			const icon = Dom.svg('image', {
				href: iconUrl,
				width: RECT_INPUT_ICON_SIZE,
				height: RECT_INPUT_ICON_SIZE,
				x: x - RECT_INPUT_ICON_SIZE / 2,
				y: y + RECT_INPUT_ICON_SIZE / -2
			});

			g.appendChild(icon);
		}
		return new InputView(g);
	}

	public static addRoundInput(parent: SVGElement, x: number, y: number) {
		const circle = Dom.svg('circle', {
			class: 'sqd-input',
			cx: x,
			xy: y,
			r: ROUND_INPUT_SIZE
		});
		parent.appendChild(circle);
		return new InputView(circle);
	}

	private constructor(
		private readonly root: SVGElement) {
	}

	public setIsHidden(isHidden: boolean) {
		Dom.attrs(this.root, {
			visibility: isHidden ? 'hidden' : 'visible'
		});
	}
}
