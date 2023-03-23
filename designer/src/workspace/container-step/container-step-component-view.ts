import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { SequentialStep } from '../../definition';
import { ClickCommand, ClickCommandType, ClickDetails, StepComponentView } from '../component';
import { SequenceComponent } from '../sequence/sequence-component';
import { InputView } from '../common-views/input-view';
import { JoinView } from '../common-views/join-view';
import { LabelView, LABEL_HEIGHT } from '../common-views/label-view';
import { RegionView } from '../common-views/region-view';
import { ComponentContext } from '../../component-context';
import { StepContext } from '../../designer-extension';
import { SequenceContext } from '../sequence/sequence-context';

const PADDING_TOP = 20;
const PADDING_X = 20;

export class ContainerStepComponentView implements StepComponentView {
	public static create(
		parentElement: SVGElement,
		stepContext: StepContext<SequentialStep>,
		componentContext: ComponentContext
	): ContainerStepComponentView {
		const { step } = stepContext;
		const g = Dom.svg('g', {
			class: `sqd-step-container sqd-type-${step.type}`
		});
		parentElement.appendChild(g);

		const labelView = LabelView.create(g, PADDING_TOP, step.name, 'primary');
		const sequenceContext: SequenceContext = {
			sequence: step.sequence,
			depth: stepContext.depth + 1,
			isInputConnected: true,
			isOutputConnected: stepContext.isOutputConnected
		};
		const component = SequenceComponent.create(g, sequenceContext, componentContext);

		const halfOfWidestElement = labelView.width / 2;
		const offsetLeft = Math.max(halfOfWidestElement - component.view.joinX, 0) + PADDING_X;
		const offsetRight = Math.max(halfOfWidestElement - (component.view.width - component.view.joinX), 0) + PADDING_X;

		const viewWidth = offsetLeft + component.view.width + offsetRight;
		const viewHeight = PADDING_TOP + LABEL_HEIGHT + component.view.height;
		const joinX = component.view.joinX + offsetLeft;

		Dom.translate(labelView.g, joinX, 0);
		Dom.translate(component.view.g, offsetLeft, PADDING_TOP + LABEL_HEIGHT);

		const iconUrl = componentContext.configuration.iconUrlProvider
			? componentContext.configuration.iconUrlProvider(step.componentType, step.type)
			: null;
		const inputView = InputView.createRectInput(g, joinX, 0, iconUrl);

		JoinView.createStraightJoin(g, new Vector(joinX, 0), PADDING_TOP);

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

	public resolveClick(click: ClickDetails): ClickCommand | null {
		if (this.regionView.resolveClick(click) || this.g.contains(click.element)) {
			return {
				type: ClickCommandType.selectStep
			};
		}
		return null;
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
