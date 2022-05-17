import { createSvgElement } from '../svg';
import { Component } from './component';

const SIZE = 30;

export class AnchorStepComponent implements Component {

	public static create(): AnchorStepComponent {
		const circle = createSvgElement('circle', {
			cx: SIZE / 2,
			cy: SIZE / 2,
			r: SIZE / 2,
			fill: '#2C18DF'
		});

		const stopSize = SIZE * 0.4;
		const stop = createSvgElement('rect', {
			x: (SIZE - stopSize) / 2,
			y: (SIZE - stopSize) / 2,
			width: stopSize,
			height: stopSize,
			rx: 3,
			ry: 3,
			fill: '#FFF'
		});

		const g = createSvgElement('g', {
			transform: `translate(300, 100)`,
		});
		g.appendChild(circle);
		g.appendChild(stop);

		return new AnchorStepComponent(g, SIZE, SIZE, SIZE / 2);
	}

	public constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly connectorX: number) {
	}
}
