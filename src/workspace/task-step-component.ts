import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { Sequence, Step, TaskStep } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { ComponentView, Placeholder, StepComponent, StepComponentState } from './component';
import { ValidationErrorRenderer } from './validation-error-renderer';

const PADDING_X = 12;
const PADDING_Y = 10;
const MIN_TEXT_WIDTH = 70;
const ICON_SIZE = 22;
const INPUT_SIZE = 6;
const OUTPUT_SIZE = 4;
const RECT_RADIUS = 5;

export class TaskStepComponent implements StepComponent {

	public static create(parent: SVGElement, step: TaskStep, parentSequence: Sequence, configuration: StepsConfiguration): TaskStepComponent {
		const view = TaskStepComponentView.create(parent, step, configuration);
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

	public static create(parent: SVGElement, step: TaskStep, configuration: StepsConfiguration): TaskStepComponentView {
		const g = Dom.svg('g', {
			class: 'sqd-task-group'
		});
		parent.appendChild(g);

		const boxHeight = ICON_SIZE + PADDING_Y * 2;

		const text = Dom.svg('text', {
			x: (ICON_SIZE + PADDING_X * 2),
			y: boxHeight / 2,
			class: 'sqd-task-text'
		});
		text.textContent = step.name;
		g.appendChild(text);
		const textWidth = Math.max(text.getBBox().width, MIN_TEXT_WIDTH);

		const boxWidth = ICON_SIZE + PADDING_X * 3 + textWidth;

		const rect = Dom.svg('rect', {
			x: 0.5,
			y: 0.5,
			class: 'sqd-task-rect',
			width: boxWidth,
			height: boxHeight,
			rx: RECT_RADIUS,
			ry: RECT_RADIUS
		});
		g.insertBefore(rect, text);

		const iconUrl = configuration.iconUrlProvider
			? configuration.iconUrlProvider(step.componentType, step.type)
			: null;
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
			x: PADDING_X,
			y: PADDING_Y,
			width: ICON_SIZE,
			height: ICON_SIZE,
		});

		const input = Dom.svg('circle', {
			class: 'sqd-task-input',
			cx: boxWidth / 2,
			xy: 0,
			r: INPUT_SIZE
		});

		const output = Dom.svg('circle', {
			class: 'sqd-task-output',
			cx: boxWidth / 2,
			cy: boxHeight,
			r: OUTPUT_SIZE
		});

		g.appendChild(icon);
		g.appendChild(input);
		g.appendChild(output);

		const validationError = ValidationErrorRenderer.create(g, boxWidth, 0);

		return new TaskStepComponentView(g, boxWidth, boxHeight, boxWidth / 2, rect, input, output, validationError);
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

	public getClientPosition(): Vector {
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
