import { SequentialStep } from 'sequential-workflow-model';
import {
	PlaceholderGapOrientation,
	RegionView,
	RegionViewFactory,
	StepComponentViewContext,
	StepComponentViewFactory,
	StepContext
} from '../../designer-extension';
import { ComponentDom, InputView, JoinView, OutputView } from '../common-views';
import { LaunchPadStepComponentViewConfiguration } from './launch-pad-step-component-view-configuration';
import { ClickCommand, ClickDetails, Placeholder, StepComponentView } from '../component';
import { Dom, getAbsolutePosition, Vector } from '../../core';
import { StepComponent } from '../step-component';

const COMPONENT_CLASS_NAME = 'launch-pad';

function createView(
	parentElement: SVGElement,
	stepContext: StepContext<SequentialStep>,
	viewContext: StepComponentViewContext,
	regionViewFactory: RegionViewFactory | null,
	isInterruptedIfEmpty: boolean,
	cfg: LaunchPadStepComponentViewConfiguration
): StepComponentView {
	const step = stepContext.step;
	const sequence = stepContext.step.sequence;
	const g = ComponentDom.stepG(COMPONENT_CLASS_NAME, step.type, step.id);
	parentElement.appendChild(g);

	const components: StepComponent[] = [];
	let width: number;
	let height: number;
	let joinX: number;

	const placeholdersX: number[] = [];
	let placeholderOrientation: PlaceholderGapOrientation;
	let placeholderSize: Vector;
	let hasOutput: boolean;

	let inputView: InputView | null = null;
	let outputView: OutputView | null = null;

	if (sequence.length > 0) {
		let maxComponentHeight = 0;
		for (let i = 0; i < sequence.length; i++) {
			const component = viewContext.createStepComponent(g, sequence, sequence[i], i);
			components.push(component);
			maxComponentHeight = Math.max(maxComponentHeight, component.view.height);
		}

		const joinsX: number[] = [];
		const positionsX: number[] = [];
		const spacesY: number[] = [];

		placeholderOrientation = PlaceholderGapOrientation.perpendicular;
		placeholderSize = viewContext.getPlaceholderGapSize(placeholderOrientation);
		placeholdersX.push(0);
		let positionX = placeholderSize.x;

		for (let i = 0; i < components.length; i++) {
			if (i > 0) {
				placeholdersX.push(positionX);
				positionX += placeholderSize.x;
			}
			const component = components[i];
			const componentY = (maxComponentHeight - component.view.height) / 2 + cfg.connectionHeight + cfg.paddingY;
			Dom.translate(component.view.g, positionX, componentY);

			joinsX.push(positionX + component.view.joinX);
			positionX += component.view.width;
			positionsX.push(positionX);
			spacesY.push(Math.max(0, (maxComponentHeight - component.view.height) / 2));
		}

		placeholdersX.push(positionX);
		positionX += placeholderSize.x;

		width = positionX;
		height = maxComponentHeight + 2 * cfg.connectionHeight + 2 * cfg.paddingY;

		const contentJoinX =
			components.length % 2 === 0
				? positionsX[Math.max(0, Math.floor(components.length / 2) - 1)] + placeholderSize.x / 2
				: joinsX[Math.floor(components.length / 2)];

		if (stepContext.isInputConnected) {
			const joinsTopY = joinsX.map(x => new Vector(x, cfg.connectionHeight));
			JoinView.createJoins(g, new Vector(contentJoinX, 0), joinsTopY);
			for (let i = 0; i < joinsX.length; i++) {
				JoinView.createStraightJoin(g, joinsTopY[i], cfg.paddingY + spacesY[i]);
			}
		}

		const joinsBottomY = joinsX.map(x => new Vector(x, cfg.connectionHeight + 2 * cfg.paddingY + maxComponentHeight));
		JoinView.createJoins(g, new Vector(contentJoinX, height), joinsBottomY);
		for (let i = 0; i < joinsX.length; i++) {
			JoinView.createStraightJoin(g, joinsBottomY[i], -(cfg.paddingY + spacesY[i]));
		}

		hasOutput = true;
		joinX = contentJoinX;
	} else {
		placeholderOrientation = PlaceholderGapOrientation.along;
		placeholderSize = viewContext.getPlaceholderGapSize(placeholderOrientation);

		placeholdersX.push(cfg.emptyPaddingX);

		width = placeholderSize.x + cfg.emptyPaddingX * 2;
		height = placeholderSize.y + cfg.emptyPaddingY * 2;
		hasOutput = !isInterruptedIfEmpty;

		if (stepContext.isInputConnected) {
			inputView = InputView.createRoundInput(g, width / 2, 0, cfg.emptyInputSize);
		}

		if (stepContext.isOutputConnected && hasOutput) {
			outputView = OutputView.create(g, width / 2, height, cfg.emptyOutputSize);
		}

		if (cfg.emptyIconSize > 0) {
			const iconUrl = viewContext.getStepIconUrl();
			if (iconUrl) {
				const icon = Dom.svg('image', {
					href: iconUrl,
					x: (width - cfg.emptyIconSize) / 2,
					y: (height - cfg.emptyIconSize) / 2,
					width: cfg.emptyIconSize,
					height: cfg.emptyIconSize
				});
				g.appendChild(icon);
			}
		}

		joinX = width / 2;
	}

	let regionView: RegionView | null = null;
	if (regionViewFactory) {
		regionView = regionViewFactory(g, [width], height);
	}

	const placeholders: Placeholder[] = [];
	const placeholderY = (height - placeholderSize.y) / 2;
	for (let i = 0; i < placeholdersX.length; i++) {
		const placeholder = viewContext.createPlaceholderForGap(g, sequence, i, placeholderOrientation);
		placeholders.push(placeholder);
		Dom.translate(placeholder.view.g, placeholdersX[i], placeholderY);
	}

	return {
		g,
		width,
		height,
		joinX,
		components,
		placeholders,
		hasOutput,

		getClientPosition(): Vector {
			return getAbsolutePosition(g);
		},
		resolveClick(click: ClickDetails): true | ClickCommand | null {
			if (regionView) {
				const result = regionView.resolveClick(click);
				return result === true || (result === null && g.contains(click.element)) ? true : result;
			}
			return null;
		},
		setIsDragging(isDragging: boolean) {
			inputView?.setIsHidden(isDragging);
			outputView?.setIsHidden(isDragging);
		},
		setIsDisabled(isDisabled: boolean) {
			Dom.toggleClass(g, isDisabled, 'sqd-disabled');
		},
		setIsSelected(isSelected: boolean) {
			regionView?.setIsSelected(isSelected);
		}
	};
}

export const createLaunchPadStepComponentViewFactory =
	(isInterruptedIfEmpty: boolean, cfg: LaunchPadStepComponentViewConfiguration): StepComponentViewFactory =>
	(parentElement: SVGElement, stepContext: StepContext<SequentialStep>, viewContext: StepComponentViewContext): StepComponentView => {
		if (cfg.isRegionEnabled) {
			return viewContext.createRegionComponentView(parentElement, COMPONENT_CLASS_NAME, (g, regionViewBuilder) => {
				return createView(g, stepContext, viewContext, regionViewBuilder, isInterruptedIfEmpty, cfg);
			});
		}
		return createView(parentElement, stepContext, viewContext, null, isInterruptedIfEmpty, cfg);
	};
