import { Svg } from '../core/svg';
import { Vector } from '../core/vector';
import { Sequence, Step, TaskStep } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { ComponentView, Placeholder, StepComponent, StepComponentState } from './component';

const WIDTH = 130;
const HEIGHT = 44;
const INPUT_SIZE = 6;
const OUTPUT_SIZE = 4;
const RADIUS = 5;

export class TaskStepComponent implements StepComponent {

	public static create(step: TaskStep, parentSequence: Sequence, configuration: DesignerConfiguration): TaskStepComponent {
		const view = TaskStepComponentView.create(step, configuration);
		return new TaskStepComponent(view, step, parentSequence);
	}

	private constructor(
		public readonly view: TaskStepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence) {
	}

	public findStepComponent(element: Element): StepComponent | null {
		return this.view.containsElement(element)
			? this
			: null;
	}

	public getPlaceholders(_: Placeholder[]) {
	}

	public setIsMoving(isMoving: boolean) {
		this.view.setIsMoving(isMoving);
	}

	public setState(state: StepComponentState) {
		switch (state) {
			case StepComponentState.default:
				this.view.setIsSelected(false);
				this.view.setIsDisabled(false);
				break;
			case StepComponentState.selected:
				this.view.setIsDisabled(false);
				this.view.setIsSelected(true);
				break;
			case StepComponentState.moving:
				this.view.setIsDisabled(true);
				this.view.setIsSelected(false);
				break;
		}
	}
}

export class TaskStepComponentView implements ComponentView {

	public static create(step: TaskStep, configuration: DesignerConfiguration): TaskStepComponentView {
		const rect = Svg.element('rect', {
			x: 0.5,
			y: 0.5,
			class: 'sqd-task-rect',
			width: WIDTH,
			height: HEIGHT,
			rx: RADIUS,
			ry: RADIUS
		});

		const text = Svg.element('text', {
			x: WIDTH / 3,
			y: HEIGHT / 2,
			class: 'sqd-task-text',
			'text-anchor': 'left',
			'style': 'dominant-baseline: central'
		});
		text.textContent = step.name;

		const iconSize = HEIGHT / 2;
		const iconUrl = configuration.stepIconUrlProvider
			? configuration.stepIconUrlProvider(step.type, step.internalType)
			: null;
		const icon = iconUrl
			? Svg.element('image', {
				href: iconUrl
			})
			: Svg.element('rect', {
				class: 'sqd-task-empty-icon',
				rx: 4,
				ry: 4
			});
		Svg.attrs(icon, {
			x: (WIDTH / 3 - iconSize) / 2,
			y: (HEIGHT - iconSize) / 2,
			width: iconSize,
			height: iconSize,
		});

		const input = Svg.element('circle', {
			cx: WIDTH / 2,
			xy: 0,
			r: INPUT_SIZE,
			fill: '#FFF',
			'stroke-width': 2,
			stroke: '#000'
		});

		const output = Svg.element('circle', {
			cx: WIDTH / 2,
			cy: HEIGHT,
			fill: '#000',
			r: OUTPUT_SIZE
		});

		const g = Svg.element('g', {
			class: 'sqd-task-group'
		});
		g.appendChild(rect);
		g.appendChild(text);
		g.appendChild(icon);
		g.appendChild(input);
		g.appendChild(output);
		return new TaskStepComponentView(g, WIDTH, HEIGHT, WIDTH / 2, rect, input, output);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly rect: SVGRectElement,
		private readonly input: SVGCircleElement,
		private readonly output: SVGCircleElement) {
	}

	public getPosition(): Vector {
		const rect = this.rect.getBoundingClientRect();
		return new Vector(rect.x, rect.y);
	}

	public containsElement(element: Element): boolean {
		return this.g.contains(element);
	}

	public setIsMoving(isEnabled: boolean) {
		const visibility = isEnabled ? 'hidden' : 'visible';
		Svg.attrs(this.input, { visibility });
		Svg.attrs(this.output, { visibility });
	}

	public setIsDisabled(isDisabled: boolean) {
		if (isDisabled) {
			this.g.classList.add('sqd-disabled');
		} else {
			this.g.classList.remove('sqd-disabled');
		}
	}

	public setIsSelected(isSelected: boolean) {
		if (isSelected) {
			this.rect.classList.add('sqd-selected');
		} else {
			this.rect.classList.remove('sqd-selected');
		}
	}
}
