import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { SequentialStep } from '../../definition';
import { ClickDetails, StepComponentView, ClickCommand } from '../component';
import { InputView } from '../common-views/input-view';
import { JoinView } from '../common-views/join-view';
import { LabelView } from '../common-views/label-view';
import { StepComponentViewContext, StepComponentViewFactory, StepContext } from '../../designer-extension';
import { ContainerStepComponentViewConfiguration } from './container-step-component-view-configuration';

const COMPONENT_CLASS_NAME = 'container';

export const createContainerStepComponentViewFactory =
	(cfg: ContainerStepComponentViewConfiguration): StepComponentViewFactory =>
	(parentElement: SVGElement, stepContext: StepContext<SequentialStep>, viewContext: StepComponentViewContext): StepComponentView => {
		return viewContext.createRegionComponentView(parentElement, COMPONENT_CLASS_NAME, (g, regionViewBuilder) => {
			const step = stepContext.step;
			const name = viewContext.getStepName();
			const labelView = LabelView.create(g, cfg.paddingTop, cfg.label, name, 'primary');
			const sequenceComponent = viewContext.createSequenceComponent(g, step.sequence);

			const halfOfWidestElement = labelView.width / 2;
			const offsetLeft = Math.max(halfOfWidestElement - sequenceComponent.view.joinX, 0) + cfg.paddingX;
			const offsetRight =
				Math.max(halfOfWidestElement - (sequenceComponent.view.width - sequenceComponent.view.joinX), 0) + cfg.paddingX;

			const width = offsetLeft + sequenceComponent.view.width + offsetRight;
			const height = cfg.paddingTop + cfg.label.height + sequenceComponent.view.height;
			const joinX = sequenceComponent.view.joinX + offsetLeft;

			Dom.translate(labelView.g, joinX, 0);
			Dom.translate(sequenceComponent.view.g, offsetLeft, cfg.paddingTop + cfg.label.height);

			let inputView: InputView | null = null;
			if (cfg.inputSize > 0) {
				const iconUrl = viewContext.getStepIconUrl();
				inputView = InputView.createRectInput(g, joinX, 0, cfg.inputSize, cfg.inputRadius, cfg.inputIconSize, iconUrl);
			}

			JoinView.createStraightJoin(g, new Vector(joinX, 0), cfg.paddingTop);

			const regionView = regionViewBuilder(g, [width], height);

			return {
				g,
				width,
				height,
				joinX,
				placeholders: null,
				sequenceComponents: [sequenceComponent],
				hasOutput: sequenceComponent.hasOutput,

				getClientPosition(): Vector {
					return regionView.getClientPosition();
				},
				resolveClick(click: ClickDetails): true | ClickCommand | null {
					const result = regionView.resolveClick(click);
					return result === true || (result === null && g.contains(click.element)) ? true : result;
				},
				setIsDragging(isDragging: boolean) {
					if (cfg.autoHideInputOnDrag && inputView) {
						inputView.setIsHidden(isDragging);
					}
				},
				setIsSelected(isSelected: boolean) {
					regionView.setIsSelected(isSelected);
				},
				setIsDisabled(isDisabled: boolean) {
					Dom.toggleClass(g, isDisabled, 'sqd-disabled');
				}
			};
		});
	};
