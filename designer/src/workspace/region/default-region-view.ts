import { Dom } from '../../core/dom';
import { getAbsolutePosition } from '../../core/get-absolute-position';
import { Vector } from '../../core/vector';
import { RegionView } from '../../designer-extension';
import { ClickDetails } from '../component';

export class DefaultRegionView implements RegionView {
	public static create(parent: SVGElement, widths: number[], height: number): DefaultRegionView {
		const totalWidth = widths.reduce((result, width) => result + width, 0);
		const lines: SVGLineElement[] = [
			drawLine(parent, 0, 0, totalWidth, 0),
			drawLine(parent, 0, 0, 0, height),
			drawLine(parent, 0, height, totalWidth, height),
			drawLine(parent, totalWidth, 0, totalWidth, height)
		];

		let offsetX = widths[0];
		for (let i = 1; i < widths.length; i++) {
			lines.push(drawLine(parent, offsetX, 0, offsetX, height));
			offsetX += widths[i];
		}
		return new DefaultRegionView(lines, totalWidth, height);
	}

	public constructor(
		private readonly lines: SVGLineElement[],
		private readonly width: number,
		private readonly height: number
	) {}

	public getClientPosition(): Vector {
		return getAbsolutePosition(this.lines[0]);
	}

	public resolveClick(click: ClickDetails): true | null {
		const regionPosition = this.getClientPosition();
		const d = click.position.subtract(regionPosition);
		if (d.x >= 0 && d.y >= 0 && d.x < this.width * click.scale && d.y < this.height * click.scale) {
			return true;
		}
		return null;
	}

	public setIsSelected(isSelected: boolean) {
		this.lines.forEach(region => {
			Dom.toggleClass(region, isSelected, 'sqd-selected');
		});
	}
}

function drawLine(parent: SVGElement, x1: number, y1: number, x2: number, y2: number): SVGLineElement {
	const line = Dom.svg('line', {
		class: 'sqd-region',
		x1,
		y1,
		x2,
		y2
	});
	parent.insertBefore(line, parent.firstChild);
	return line;
}
