import { Dom } from '../../core/dom';
import { Vector } from '../../core/vector';
import { ContainerStep } from '../../definition';
import { ClickDetails, ComponentView } from '../component';
import { SequenceComponent } from '../sequence/sequence-component';
import { InputView } from '../common-views/input-view';
import { JoinView } from '../common-views/join-view';
import { LabelView, LABEL_HEIGHT } from '../common-views/label-view';
import { RegionView } from '../common-views/region-view';
import { ValidationErrorView } from '../common-views/validation-error-view';
import { ComponentContext } from '../component-context';

const PADDING_TOP = 20;
const PADDING_X = 20;

export class ContainerStepComponentView implements ComponentView {
	public static create(parent: SVGElement, step: ContainerStep, context: ComponentContext): ContainerStepComponentView {
		const g = Dom.svg('g', {
			class: `sqd-step-container sqd-type-${step.type}`
		});
		parent.appendChild(g);

		const labelView = LabelView.create(g, PADDING_TOP, step.name, 'primary');
		const component = SequenceComponent.create(g, step.sequence, context);

		const halfOfWidestElement = labelView.width / 2;
		const offsetLeft = Math.max(halfOfWidestElement - component.view.joinX, 0) + PADDING_X;
		const offsetRight = Math.max(halfOfWidestElement - (component.view.width - component.view.joinX), 0) + PADDING_X;

		const viewWidth = offsetLeft + component.view.width + offsetRight;
		const viewHeight = PADDING_TOP + LABEL_HEIGHT + component.view.height;
		const joinX = component.view.joinX + offsetLeft;

		Dom.translate(labelView.g, joinX, 0);
		Dom.translate(component.view.g, offsetLeft, PADDING_TOP + LABEL_HEIGHT);

		const iconUrl = context.configuration.iconUrlProvider ? context.configuration.iconUrlProvider(step.componentType, step.type) : null;
		const inputView = InputView.createRectInput(g, joinX, 0, iconUrl);

		JoinView.createStraightJoin(g, new Vector(joinX, 0), PADDING_TOP);

		const regionView = RegionView.create(g, [viewWidth], viewHeight);

		const validationErrorView = ValidationErrorView.create(g, viewWidth, 0);

		return new ContainerStepComponentView(g, viewWidth, viewHeight, joinX, component, inputView, regionView, validationErrorView);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly sequenceComponent: SequenceComponent,
		private readonly inputView: InputView,
		private readonly regionView: RegionView,
		private readonly validationErrorView: ValidationErrorView
	) {}

	public getClientPosition(): Vector {
		return this.regionView.getClientPosition();
	}

	public resolveClick(click: ClickDetails): boolean {
		return this.regionView.resolveClick(click) || this.g.contains(click.element);
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

	public setIsValid(isHidden: boolean) {
		this.validationErrorView.setIsHidden(isHidden);
	}

	public isInterrupted(): boolean {
		return this.sequenceComponent.isInterrupted;
	}
}
