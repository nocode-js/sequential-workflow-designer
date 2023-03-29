import { Dom } from '../../core/dom';

export class LabelView {
	public static create(
		parent: SVGElement,
		y: number,
		minWidth: number,
		height: number,
		paddingX: number,
		radius: number,
		text: string,
		theme: 'primary' | 'secondary'
	): LabelView {
		const g = Dom.svg('g', {
			class: 'sqd-label'
		});
		parent.appendChild(g);

		const nameText = Dom.svg('text', {
			class: 'sqd-label-text',
			y: y + height / 2
		});
		nameText.textContent = text;
		g.appendChild(nameText);
		const width = Math.max(nameText.getBBox().width + paddingX * 2, minWidth);

		const nameRect = Dom.svg('rect', {
			class: `sqd-label-rect sqd-label-${theme}`,
			width: width,
			height: height,
			x: -width / 2,
			y,
			rx: radius,
			ry: radius
		});
		g.insertBefore(nameRect, nameText);
		return new LabelView(g, width, height);
	}

	public constructor(public readonly g: SVGGElement, public readonly width: number, public readonly height: number) {}
}
