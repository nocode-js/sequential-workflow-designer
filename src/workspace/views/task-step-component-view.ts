import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { TaskStep } from '../../definition';
import { StepsConfiguration } from '../../designer-configuration';
import { ComponentView } from '../component';
import { InputView } from './input-view';
import { OutputView } from './output-view';
import { ValidationErrorView } from './validation-error-view';

const PADDING_X = 12;
const PADDING_Y = 10;
const MIN_TEXT_WIDTH = 70;
const ICON_SIZE = 22;
const RECT_RADIUS = 5;

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
		g.appendChild(icon);

		const inputView = InputView.createRoundInput(g, boxWidth / 2, 0)
		const outputView = OutputView.create(g, boxWidth / 2, boxHeight);

		const validationErrorView = ValidationErrorView.create(g, boxWidth, 0);

		return new TaskStepComponentView(g, boxWidth, boxHeight, boxWidth / 2, rect, inputView, outputView, validationErrorView);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly rect: SVGRectElement,
		private readonly inputView: InputView,
		private readonly outputView: OutputView,
		private readonly validationErrorView: ValidationErrorView) {
	}

	public getClientPosition(): Vector {
		const rect = this.rect.getBoundingClientRect();
		return new Vector(rect.x, rect.y);
	}

	public containsElement(element: Element): boolean {
		return this.g.contains(element);
	}

	public setIsDragging(isDragging: boolean) {
		this.inputView.setIsHidden(isDragging);
		this.outputView.setIsHidden(isDragging);
	}

	public setIsDisabled(isDisabled: boolean) {
		Dom.toggleClass(this.g, isDisabled, 'sqd-disabled');
	}

	public setIsSelected(isSelected: boolean) {
		Dom.toggleClass(this.rect, isSelected, 'sqd-selected');
	}

	public setIsValid(isValid: boolean) {
		this.validationErrorView.setIsHidden(isValid);
	}
}
