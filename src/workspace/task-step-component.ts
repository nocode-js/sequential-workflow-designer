import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { Sequence, Step, TaskStep } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { ComponentView, Placeholder, StepComponent, StepComponentState } from './component';
import { ValidationErrorRenderer } from './validation-error-renderer';

const WIDTH = 130;
const HEIGHT = 44;
const INPUT_SIZE = 6;
const OUTPUT_SIZE = 4;
const RECT_RADIUS = 5;

export class TaskStepComponent implements StepComponent {

	public static create(step: TaskStep, parentSequence: Sequence, configuration: StepsConfiguration): TaskStepComponent {
		const iconUrl = configuration.iconUrlProvider
			? configuration.iconUrlProvider(step.componentType, step.type)
			: null;
		const view = TaskStepComponentView.create(step, iconUrl);
		return new TaskStepComponent(view, step, parentSequence, configuration);
	}

	private constructor(
		public readonly view: TaskStepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence,
		private readonly configuration: StepsConfiguration) {
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

	public validate(): boolean {
		const isValid = this.configuration.validator
			? this.configuration.validator(this.step)
			: true;
		this.view.setIsValidationErrorHidden(isValid);
		return isValid;
	}
}

export class TaskStepComponentView implements ComponentView {

	public static create(step: TaskStep, iconUrl: string | null): TaskStepComponentView {
		const rect = Dom.svg('rect', {
			x: 0.5,
			y: 0.5,
			class: 'sqd-task-rect',
			width: WIDTH,
			height: HEIGHT,
			rx: RECT_RADIUS,
			ry: RECT_RADIUS
		});

		const text = Dom.svg('text', {
			x: WIDTH / 3,
			y: HEIGHT / 2,
			class: 'sqd-task-text'
		});
		text.textContent = step.name;

		const iconSize = HEIGHT / 2;
		const icon = iconUrl
			? Dom.svg('image', {
				href: iconUrl
			})
			: Dom.svg('rect', {
				class: 'sqd-task-empty-icon',
				rx: 4,
				ry: 4
			});
		Dom.attrs(icon, {
			x: (WIDTH / 3 - iconSize) / 2,
			y: (HEIGHT - iconSize) / 2,
			width: iconSize,
			height: iconSize,
		});

		const input = Dom.svg('circle', {
			class: 'sqd-task-input',
			cx: WIDTH / 2,
			xy: 0,
			r: INPUT_SIZE
		});

		const output = Dom.svg('circle', {
			class: 'sqd-task-output',
			cx: WIDTH / 2,
			cy: HEIGHT,
			r: OUTPUT_SIZE
		});

		const g = Dom.svg('g', {
			class: 'sqd-task-group'
		});
		g.appendChild(rect);
		g.appendChild(text);
		g.appendChild(icon);
		g.appendChild(input);
		g.appendChild(output);

		const validationError = ValidationErrorRenderer.append(g, WIDTH, 0);

		return new TaskStepComponentView(g, WIDTH, HEIGHT, WIDTH / 2, rect, input, output, validationError);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly rect: SVGRectElement,
		private readonly input: SVGCircleElement,
		private readonly output: SVGCircleElement,
		private readonly validationError: SVGElement) {
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
		Dom.attrs(this.input, { visibility });
		Dom.attrs(this.output, { visibility });
	}

	public setIsDisabled(isDisabled: boolean) {
		Dom.toggleClass(this.g, isDisabled, 'sqd-disabled');
	}

	public setIsSelected(isSelected: boolean) {
		Dom.toggleClass(this.rect, isSelected, 'sqd-selected');
	}

	public setIsValidationErrorHidden(isHidden: boolean) {
		Dom.toggleClass(this.validationError, isHidden, 'sqd-hidden');
	}
}
