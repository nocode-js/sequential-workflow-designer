import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';

export class RegionView {
	public static create(parent: SVGElement, widths: number[], height: number): RegionView {
		const totalWidth = widths.reduce((c, v) => c + v, 0);

		const mainRegion = Dom.svg('rect', {
			class: 'sqd-region',
			width: totalWidth,
			height,
			fill: 'transparent',
			rx: 5,
			ry: 5
		});
		const regions: SVGElement[] = [mainRegion];
		parent.insertBefore(mainRegion, parent.firstChild);

		let offsetX = widths[0];
		for (let i = 1; i < widths.length; i++) {
			const line = Dom.svg('line', {
				class: 'sqd-region',
				x1: offsetX,
				y1: 0,
				x2: offsetX,
				y2: height
			});
			regions.push(line);
			parent.insertBefore(line, parent.firstChild);
			offsetX += widths[i];
		}

		return new RegionView(regions);
	}

	public constructor(private readonly regions: SVGElement[]) {}

	public getClientPosition(): Vector {
		const rect = this.regions[0].getBoundingClientRect();
		return new Vector(rect.x, rect.y);
	}

	public setIsSelected(isSelected: boolean) {
		this.regions.forEach(region => {
			Dom.toggleClass(region, isSelected, 'sqd-selected');
		});
	}
}
