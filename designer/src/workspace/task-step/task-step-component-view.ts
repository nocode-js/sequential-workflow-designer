import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { Step } from '../../definition';
import { StepComponentViewContext, StepComponentViewFactory, StepContext } from '../../designer-extension';
import { InputView } from '../common-views/input-view';
import { OutputView } from '../common-views/output-view';
import { ClickDetails, StepComponentView } from '../component';
import { TaskStepComponentViewConfiguration } from './task-step-component-view-configuration';

export const createTaskStepComponentViewFactory =
	(isInterrupted: boolean, cfg: TaskStepComponentViewConfiguration): StepComponentViewFactory =>
	(parentElement: SVGElement, stepContext: StepContext<Step>, viewContext: StepComponentViewContext): StepComponentView => {
		const { step } = stepContext;
		const g = Dom.svg('g', {
			class: `sqd-step-task sqd-type-${step.type}`
		});
		parentElement.appendChild(g);

		const boxHeight = cfg.paddingY * 2 + cfg.iconSize;

		const text = Dom.svg('text', {
			x: cfg.paddingLeft + cfg.iconSize + cfg.textMarginLeft,
			y: boxHeight / 2,
			class: 'sqd-step-task-text'
		});
		text.textContent = step.name;
		g.appendChild(text);
		const textWidth = Math.max(text.getBBox().width, cfg.minTextWidth);

		const boxWidth = cfg.iconSize + cfg.paddingLeft + cfg.paddingRight + cfg.textMarginLeft + textWidth;

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

		const iconUrl = viewContext.getStepIconUrl();
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
			x: cfg.paddingLeft,
			y: cfg.paddingY,
			width: cfg.iconSize,
			height: cfg.iconSize
		});
		g.appendChild(icon);

		const isInputViewHidden = stepContext.depth === 0 && stepContext.position === 0 && !stepContext.isInputConnected;
		const isOutputViewHidden = isInterrupted;

		const inputView = isInputViewHidden ? null : InputView.createRoundInput(g, boxWidth / 2, 0, cfg.inputSize);
		const outputView = isOutputViewHidden ? null : OutputView.create(g, boxWidth / 2, boxHeight, cfg.outputSize);

		return {
			g,
			width: boxWidth,
			height: boxHeight,
			joinX: boxWidth / 2,
			sequenceComponents: null,
			placeholders: null,

			hasOutput(): boolean {
				return !!outputView;
			},
			getClientPosition(): Vector {
				const r = rect.getBoundingClientRect();
				return new Vector(r.x, r.y);
			},
			resolveClick(click: ClickDetails): true | null {
				return g.contains(click.element) ? true : null;
			},
			setIsDragging(isDragging: boolean) {
				inputView?.setIsHidden(isDragging);
				outputView?.setIsHidden(isDragging);
			},
			setIsDisabled(isDisabled: boolean) {
				Dom.toggleClass(g, isDisabled, 'sqd-disabled');
			},
			setIsSelected(isSelected: boolean) {
				Dom.toggleClass(rect, isSelected, 'sqd-selected');
			}
		};
	};
