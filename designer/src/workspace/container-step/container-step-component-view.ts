import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { SequentialStep } from '../../definition';
import { ClickDetails, StepComponentView } from '../component';
import { InputView } from '../common-views/input-view';
import { JoinView } from '../common-views/join-view';
import { LabelView } from '../common-views/label-view';
import { RegionView } from '../common-views/region-view';
import { StepComponentViewContext, StepComponentViewFactory, StepContext } from '../../designer-extension';
import { ContainerStepComponentViewConfiguration } from './container-step-component-view-configuration';

export const createContainerStepComponentViewFactory =
	(cfg: ContainerStepComponentViewConfiguration): StepComponentViewFactory =>
	(parentElement: SVGElement, stepContext: StepContext<SequentialStep>, viewContext: StepComponentViewContext): StepComponentView => {
		const { step } = stepContext;
		const g = Dom.svg('g', {
			class: `sqd-step-container sqd-type-${step.type}`
		});
		parentElement.appendChild(g);

		const labelView = LabelView.create(g, cfg.paddingTop, cfg.label, step.name, 'primary');
		const sequenceComponent = viewContext.createSequenceComponent(g, step.sequence);

		const halfOfWidestElement = labelView.width / 2;
		const offsetLeft = Math.max(halfOfWidestElement - sequenceComponent.view.joinX, 0) + cfg.paddingX;
		const offsetRight = Math.max(halfOfWidestElement - (sequenceComponent.view.width - sequenceComponent.view.joinX), 0) + cfg.paddingX;

		const width = offsetLeft + sequenceComponent.view.width + offsetRight;
		const height = cfg.paddingTop + cfg.label.height + sequenceComponent.view.height;
		const joinX = sequenceComponent.view.joinX + offsetLeft;

		Dom.translate(labelView.g, joinX, 0);
		Dom.translate(sequenceComponent.view.g, offsetLeft, cfg.paddingTop + cfg.label.height);

		const iconUrl = viewContext.getStepIconUrl();
		const inputView = InputView.createRectInput(g, joinX, 0, cfg.inputSize, cfg.inputIconSize, iconUrl);

		JoinView.createStraightJoin(g, new Vector(joinX, 0), cfg.paddingTop);

		const regionView = RegionView.create(g, [width], height);

		return {
			g,
			width,
			height,
			joinX,
			placeholders: null,
			sequenceComponents: [sequenceComponent],

			getClientPosition(): Vector {
				return regionView.getClientPosition();
			},
			resolveClick(click: ClickDetails): true | null {
				return regionView.resolveClick(click) || g.contains(click.element) ? true : null;
			},
			setIsDragging(isDragging: boolean) {
				inputView.setIsHidden(isDragging);
			},
			setIsSelected(isSelected: boolean) {
				regionView.setIsSelected(isSelected);
			},
			setIsDisabled(isDisabled: boolean) {
				Dom.toggleClass(g, isDisabled, 'sqd-disabled');
			},
			hasOutput(): boolean {
				return sequenceComponent.hasOutput;
			}
		};
	};
