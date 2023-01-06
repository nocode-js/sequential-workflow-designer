import { Dom } from '../../core/dom';

export const LABEL_HEIGHT = 22;
const LABEL_PADDING_X = 10;
const MIN_LABEL_WIDTH = 50;

export class LabelView {
	public static create(parent: SVGElement, y: number, text: string, theme: 'primary' | 'secondary'): LabelView {
		const g = Dom.svg('g', {
			class: 'sqd-label'
		});
		parent.appendChild(g);

		const nameText = Dom.svg('text', {
			class: 'sqd-label-text',
			y: y + LABEL_HEIGHT / 2
		});
		nameText.textContent = text;
		g.appendChild(nameText);
		const width = Math.max(nameText.getBBox().width + LABEL_PADDING_X * 2, MIN_LABEL_WIDTH);

		const nameRect = Dom.svg('rect', {
			class: `sqd-label-rect sqd-label-${theme}`,
			width: width,
			height: LABEL_HEIGHT,
			x: -width / 2,
			y,
			rx: 10,
			ry: 10
		});
		g.insertBefore(nameRect, nameText);
		return new LabelView(g, width, LABEL_HEIGHT);
	}

	public constructor(public readonly g: SVGGElement, public readonly width: number, public readonly height: number) {}
}
