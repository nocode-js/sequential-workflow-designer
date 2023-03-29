import { ComponentContext } from '../../component-context';
import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { Step } from '../../definition';
import { StepContext } from '../../designer-extension';
import { InputView } from '../common-views/input-view';
import { OutputView } from '../common-views/output-view';
import { ClickDetails, StepComponentView } from '../component';
import { TaskStepComponentViewConfiguration } from './task-step-component-view-configuration';

export class TaskStepComponentView implements StepComponentView {
	public static create(
		parentElement: SVGElement,
		stepContext: StepContext<Step>,
		isInterrupted: boolean,
		componentContext: ComponentContext,
		cfg: TaskStepComponentViewConfiguration
	): TaskStepComponentView {
		const { step } = stepContext;
		const g = Dom.svg('g', {
			class: `sqd-step-task sqd-type-${step.type}`
		});
		parentElement.appendChild(g);

		const boxHeight = cfg.paddingY * 2 + cfg.iconSize;

		const text = Dom.svg('text', {
			x: cfg.paddingX + cfg.iconSize + cfg.textMarginLeft,
			y: boxHeight / 2,
			class: 'sqd-step-task-text'
		});
		text.textContent = step.name;
		g.appendChild(text);
		const textWidth = Math.max(text.getBBox().width, cfg.minTextWidth);

		const boxWidth = cfg.iconSize + cfg.paddingX * 2 + cfg.textMarginLeft + textWidth;

		const rect = Dom.svg('rect', {
			x: 0.5,
			y: 0.5,
			class: 'sqd-step-task-rect',
			width: boxWidth,
			height: boxHeight,
			rx: cfg.radius,
			ry: cfg.radius
		});
		g.insertBefore(rect, text);

		const iconUrl = componentContext.configuration.iconUrlProvider
			? componentContext.configuration.iconUrlProvider(step.componentType, step.type)
			: null;
		const icon = iconUrl
			? Dom.svg('image', {
					href: iconUrl
			  })
			: Dom.svg('rect', {
					class: 'sqd-step-task-empty-icon',
					rx: cfg.radius,
					ry: cfg.radius
			  });
		Dom.attrs(icon, {
			x: cfg.paddingX,
			y: cfg.paddingY,
			width: cfg.iconSize,
			height: cfg.iconSize
		});
		g.appendChild(icon);

		const isInputViewHidden = stepContext.depth === 0 && stepContext.position === 0 && !stepContext.isInputConnected;
		const isOutputViewHidden = isInterrupted;

		const inputView = isInputViewHidden ? null : InputView.createRoundInput(g, boxWidth / 2, 0, cfg.inputSize);
		const outputView = isOutputViewHidden ? null : OutputView.create(g, boxWidth / 2, boxHeight, cfg.outputSize);
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

	public resolveClick(click: ClickDetails): true | null {
		return this.g.contains(click.element) ? true : null;
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
