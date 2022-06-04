import { Dom } from '../../core/dom';

const OUTPUT_SIZE = 5;

export class OutputView {
	public static create(parent: SVGElement, x: number, y: number): OutputView {
		const circle = Dom.svg('circle', {
			class: 'sqd-output',
			cx: x,
			cy: y,
			r: OUTPUT_SIZE
		});
		parent.appendChild(circle);
		return new OutputView(circle);
	}

	public constructor(private readonly root: SVGElement) {}

	public setIsHidden(isHidden: boolean) {
		Dom.attrs(this.root, {
			visibility: isHidden ? 'hidden' : 'visible'
		});
	}
}
