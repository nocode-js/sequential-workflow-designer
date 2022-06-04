import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';

export class RegionView {
	public static create(parent: SVGElement, widths: number[], height: number): RegionView {
		let offsetX = 0;
		const regions = widths.map(width => {
			const region = Dom.svg('rect', {
				class: 'sqd-region ',
				width,
				height,
				x: offsetX,
				fill: 'transparent'
			});
			parent.insertBefore(region, parent.firstChild);
			offsetX += width;
			return region;
		});
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
