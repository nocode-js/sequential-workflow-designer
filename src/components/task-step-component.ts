import { TaskStep } from '../definition';
import { createSvgElement } from '../svg';
import { Component } from './component';

const WIDTH = 136;
const HEIGHT = 44;

export class TaskStepComponent implements Component {

	public static create(step: TaskStep) {
		const rect = createSvgElement('rect', {
			x: 0.5,
			y: 0.5,
			class: 'sqd-activity',
			width: WIDTH,
			height: HEIGHT,
			fill: '#FFF',
			rx: 4,
			ry: 5,
			'stroke-width': 1,
			stroke: '#C3C3C3'
		});

		const title = createSvgElement('text', {
			x: WIDTH / 3,
			y: HEIGHT / 2,
			class: 'sqd-activity-text',
			'text-anchor': 'left',
			'style': 'dominant-baseline: central'
		});
		title.textContent = step.name;

		const imageSize = HEIGHT / 2;
		const image = createSvgElement('rect', {
			x: (WIDTH / 3 - imageSize) / 2,
			y: (HEIGHT - imageSize) / 2,
			width: imageSize,
			height: imageSize,
			fill: '#2C18DF'
			// href: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg=='
		});

		const input = createSvgElement('circle', {
			cx: WIDTH / 2,
			xy: 0,
			r: 6,
			fill: '#FFF',
			'stroke-width': 2,
			stroke: '#000'
		});

		const output = createSvgElement('circle', {
			cx: WIDTH / 2,
			cy: HEIGHT,
			fill: '#000',
			r: 4
		});

		const g = createSvgElement('g', {
			transform: `translate(100, 100)`,
		});
		g.appendChild(rect);
		g.appendChild(title);
		g.appendChild(image);
		g.appendChild(input);
		g.appendChild(output);

		return new TaskStepComponent(g, WIDTH, HEIGHT, WIDTH / 2);
	}

	public constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly connectorX: number) {
	}
}
