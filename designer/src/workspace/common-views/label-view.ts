import { Dom } from '../../core/dom';
import { LabelViewConfiguration } from './label-view-configuration';

export class LabelView {
	public static create(
		parent: SVGElement,
		y: number,
		cfg: LabelViewConfiguration,
		text: string,
		theme: 'primary' | 'secondary'
	): LabelView {
		const g = Dom.svg('g', {
			class: `sqd-label sqd-label-${theme}`
		});
		parent.appendChild(g);

		const nameText = Dom.svg('text', {
			class: 'sqd-label-text',
			y: y + cfg.height / 2
		});
		nameText.textContent = text;
		g.appendChild(nameText);
		const width = Math.max(nameText.getBBox().width + cfg.paddingX * 2, cfg.minWidth);

		const nameRect = Dom.svg('rect', {
			class: 'sqd-label-rect',
			width: width,
			height: cfg.height,
			x: -width / 2 + 0.5,
			y: y + 0.5,
			rx: cfg.radius,
			ry: cfg.radius
		});
		g.insertBefore(nameRect, nameText);
		return new LabelView(g, width, cfg.height);
	}

	public constructor(public readonly g: SVGGElement, public readonly width: number, public readonly height: number) {}
}
