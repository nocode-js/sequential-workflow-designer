import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { SequentialStep } from '../../definition';
import { ClickDetails, StepComponentView } from '../component';
import { SequenceComponent } from '../sequence/sequence-component';
import { InputView } from '../common-views/input-view';
import { JoinView } from '../common-views/join-view';
import { LabelView } from '../common-views/label-view';
import { RegionView } from '../common-views/region-view';
import { ComponentContext } from '../../component-context';
import { StepContext } from '../../designer-extension';
import { SequenceContext } from '../sequence/sequence-context';
import { ContainerStepComponentViewConfiguration } from './container-step-component-view-configuration';

export class ContainerStepComponentView implements StepComponentView {
	public static create(
		parentElement: SVGElement,
		stepContext: StepContext<SequentialStep>,
		componentContext: ComponentContext,
		cfg: ContainerStepComponentViewConfiguration
	): ContainerStepComponentView {
		const { step } = stepContext;
		const g = Dom.svg('g', {
			class: `sqd-step-container sqd-type-${step.type}`
		});
		parentElement.appendChild(g);

		const labelView = LabelView.create(
			g,
			cfg.paddingTop,
			cfg.labelMinWidth,
			cfg.labelHeight,
			cfg.labelPaddingX,
			cfg.labelRadius,
			step.name,
			'primary'
		);
		const sequenceContext: SequenceContext = {
			sequence: step.sequence,
			depth: stepContext.depth + 1,
			isInputConnected: true,
			isOutputConnected: stepContext.isOutputConnected
		};
		const component = SequenceComponent.create(g, sequenceContext, componentContext);

		const halfOfWidestElement = labelView.width / 2;
		const offsetLeft = Math.max(halfOfWidestElement - component.view.joinX, 0) + cfg.paddingX;
		const offsetRight = Math.max(halfOfWidestElement - (component.view.width - component.view.joinX), 0) + cfg.paddingX;

		const viewWidth = offsetLeft + component.view.width + offsetRight;
		const viewHeight = cfg.paddingTop + cfg.labelHeight + component.view.height;
		const joinX = component.view.joinX + offsetLeft;

		Dom.translate(labelView.g, joinX, 0);
		Dom.translate(component.view.g, offsetLeft, cfg.paddingTop + cfg.labelHeight);

		const iconUrl = componentContext.configuration.iconUrlProvider
			? componentContext.configuration.iconUrlProvider(step.componentType, step.type)
			: null;
		const inputView = InputView.createRectInput(g, joinX, 0, cfg.inputSize, cfg.inputIconSize, iconUrl);

		JoinView.createStraightJoin(g, new Vector(joinX, 0), cfg.paddingTop);

		const regionView = RegionView.create(g, [viewWidth], viewHeight);

		return new ContainerStepComponentView(g, viewWidth, viewHeight, joinX, component, inputView, regionView);
	}

	public readonly sequenceComponents = [this.sequenceComponent];
	public readonly placeholders = null;

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		private readonly sequenceComponent: SequenceComponent,
		private readonly inputView: InputView,
		private readonly regionView: RegionView
	) {}

	public getClientPosition(): Vector {
		return this.regionView.getClientPosition();
	}

	public resolveClick(click: ClickDetails): true | null {
		return this.regionView.resolveClick(click) || this.g.contains(click.element) ? true : null;
	}

	public setIsDragging(isDragging: boolean) {
		this.inputView.setIsHidden(isDragging);
		this.sequenceComponent.setIsDragging(isDragging);
	}

	public setIsSelected(isSelected: boolean) {
		this.regionView.setIsSelected(isSelected);
	}

	public setIsDisabled(isDisabled: boolean) {
		Dom.toggleClass(this.g, isDisabled, 'sqd-disabled');
	}

	public hasOutput(): boolean {
		return this.sequenceComponent.hasOutput;
	}
}
