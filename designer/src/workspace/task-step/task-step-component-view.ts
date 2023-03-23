import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { Step } from '../../definition';
import { StepsConfiguration } from '../../designer-configuration';
import { StepContext } from '../../designer-extension';
import { InputView } from '../common-views/input-view';
import { OutputView } from '../common-views/output-view';
import { ClickDetails, ClickCommand, ClickCommandType, StepComponentView } from '../component';

const PADDING_X = 12;
const PADDING_Y = 10;
const MIN_TEXT_WIDTH = 70;
const ICON_SIZE = 22;
const RECT_RADIUS = 5;

export class TaskStepComponentView implements StepComponentView {
	public static create(
		parentElement: SVGElement,
		stepContext: StepContext<Step>,
		configuration: StepsConfiguration,
		isInterrupted: boolean
	): TaskStepComponentView {
		const { step } = stepContext;
		const g = Dom.svg('g', {
			class: `sqd-step-task sqd-type-${step.type}`
		});
		parentElement.appendChild(g);

		const boxHeight = ICON_SIZE + PADDING_Y * 2;

		const text = Dom.svg('text', {
			x: ICON_SIZE + PADDING_X * 2,
			y: boxHeight / 2,
			class: 'sqd-step-task-text'
		});
		text.textContent = step.name;
		g.appendChild(text);
		const textWidth = Math.max(text.getBBox().width, MIN_TEXT_WIDTH);

		const boxWidth = ICON_SIZE + PADDING_X * 3 + textWidth;

		const rect = Dom.svg('rect', {
			x: 0.5,
			y: 0.5,
			class: 'sqd-step-task-rect',
			width: boxWidth,
			height: boxHeight,
			rx: RECT_RADIUS,
			ry: RECT_RADIUS
		});
		g.insertBefore(rect, text);

		const iconUrl = configuration.iconUrlProvider ? configuration.iconUrlProvider(step.componentType, step.type) : null;
		const icon = iconUrl
			? Dom.svg('image', {
					href: iconUrl
			  })
			: Dom.svg('rect', {
					class: 'sqd-step-task-empty-icon',
					rx: 4,
					ry: 4
			  });
		Dom.attrs(icon, {
			x: PADDING_X,
			y: PADDING_Y,
			width: ICON_SIZE,
			height: ICON_SIZE
		});
		g.appendChild(icon);

		const isInputViewHidden = stepContext.depth === 0 && stepContext.position === 0 && !stepContext.isInputConnected;
		const isOutputViewHidden = isInterrupted;

		const inputView = isInputViewHidden ? null : InputView.createRoundInput(g, boxWidth / 2, 0);
		const outputView = isOutputViewHidden ? null : OutputView.create(g, boxWidth / 2, boxHeight);
		return new TaskStepComponentView(g, boxWidth, boxHeight, boxWidth / 2, rect, inputView, outputView);
	}

	public readonly sequenceComponents = null;
	public readonly placeholders = null;

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly rect: SVGRectElement,
		private readonly inputView: InputView | null,
		private readonly outputView: OutputView | null
	) {}

	public hasOutput(): boolean {
		return !!this.outputView;
	}

	public getClientPosition(): Vector {
		const rect = this.rect.getBoundingClientRect();
		return new Vector(rect.x, rect.y);
	}

	public resolveClick(click: ClickDetails): ClickCommand | null {
		if (this.g.contains(click.element)) {
			return {
				type: ClickCommandType.selectStep
			};
		}
		return null;
	}

	public setIsDragging(isDragging: boolean) {
		this.inputView?.setIsHidden(isDragging);
		this.outputView?.setIsHidden(isDragging);
	}

	public setIsDisabled(isDisabled: boolean) {
		Dom.toggleClass(this.g, isDisabled, 'sqd-disabled');
	}

	public setIsSelected(isSelected: boolean) {
		Dom.toggleClass(this.rect, isSelected, 'sqd-selected');
	}
}
