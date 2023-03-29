import { Dom } from '../../core/dom';

export class OutputView {
	public static create(parent: SVGElement, x: number, y: number, size: number): OutputView {
		const circle = Dom.svg('circle', {
			class: 'sqd-output',
			cx: x,
			cy: y,
			r: size / 2
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
