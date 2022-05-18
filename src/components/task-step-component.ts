import { TaskStep } from '../definition';
import { Svg } from '../svg';
import { StepComponent, StepComponentState } from './component';

const WIDTH = 136;
const HEIGHT = 44;

export class TaskStepComponent implements StepComponent {

	public static create(step: TaskStep) {
		const rect = Svg.element('rect', {
			x: 0.5,
			y: 0.5,
			class: 'sqd-task-rect',
			width: WIDTH,
			height: HEIGHT,
			rx: 5,
			ry: 5
		});

		const text = Svg.element('text', {
			x: WIDTH / 3,
			y: HEIGHT / 2,
			class: 'sqd-task-text',
			'text-anchor': 'left',
			'style': 'dominant-baseline: central'
		});
		text.textContent = step.name;

		const imageSize = HEIGHT / 2;
		const image = Svg.element('rect', {
			x: (WIDTH / 3 - imageSize) / 2,
			y: (HEIGHT - imageSize) / 2,
			width: imageSize,
			height: imageSize,
			fill: '#2C18DF'
		});

		const input = Svg.element('circle', {
			cx: WIDTH / 2,
			xy: 0,
			r: 6,
			fill: '#FFF',
			'stroke-width': 2,
			stroke: '#000'
		});

		const output = Svg.element('circle', {
			cx: WIDTH / 2,
			cy: HEIGHT,
			fill: '#000',
			r: 4
		});

		const g = Svg.element('g', {
			class: 'sqd-task-group'
		});
		g.appendChild(rect);
		g.appendChild(text);
		g.appendChild(image);
		g.appendChild(input);
		g.appendChild(output);

		return new TaskStepComponent(g, WIDTH, HEIGHT, WIDTH / 2, rect, input, output);
	}

	public constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly rect: SVGRectElement,
		private readonly input: SVGCircleElement,
		private readonly output: SVGCircleElement) {
	}

	public findComponent(element: SVGElement): StepComponent | null {
		return Svg.isChildOf(this.g, element)
			? this
			: null;
	}

	public setDropMode(isEnabled: boolean) {
		const visibility = isEnabled ? 'hidden' : 'visible';
		Svg.attrs(this.input, { visibility });
		Svg.attrs(this.output, { visibility });
	}

	public setState(state: StepComponentState) {
		switch (state) {
			case StepComponentState.selected:
				this.rect.classList.add('sqd-selected');
				this.g.classList.remove('sqd-moving');
				break;
			case StepComponentState.default:
				this.rect.classList.remove('sqd-selected');
				this.g.classList.remove('sqd-moving');
				break;
			case StepComponentState.moving:
				this.rect.classList.remove('sqd-selected');
				this.g.classList.add('sqd-moving');
				break;
		}
	}
}
