import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { ContainerStep, Sequence, Step } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { ComponentView, Placeholder, StepComponent, StepComponentState } from './component';
import { SequenceComponent } from './sequence-component';
import { InputView } from './views/input-view';
import { JoinView } from './views/join-view';
import { LabelView } from './views/label-view';
import { RegionView } from './views/region-view';
import { ValidationErrorView } from './views/validation-error-view';

const PADDING_TOP = 20;
const PADDING_X = 20;
const LABEL_HEIGHT = 22;

export class ContainerStepComponent implements StepComponent {

	public static create(parent: SVGElement, step: ContainerStep, parentSequence: Sequence, configuration: StepsConfiguration): ContainerStepComponent {
		const view = ContainerStepComponentView.create(parent, step, configuration);
		return new ContainerStepComponent(view, step, parentSequence, configuration);
	}

	private currentState = StepComponentState.default;

	private constructor(
		public readonly view: ContainerStepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence,
		private readonly configuration: StepsConfiguration) {
	}

	public findByElement(element: Element): StepComponent | null {
		const sc = this.view.sequenceComponent.findByElement(element);
		if (sc) {
			return sc;
		}
		if (this.view.containsElement(element)) {
			return this;
		}
		return null;
	}

	public findById(stepId: string): StepComponent | null {
		const sc = this.view.sequenceComponent.findById(stepId);
		if (sc) {
			return sc;
		}
		if (this.step.id === stepId) {
			return this;
		}
		return null;
	}

	public getPlaceholders(result: Placeholder[]) {
		if (this.currentState !== StepComponentState.dragging) {
			this.view.sequenceComponent.getPlaceholders(result);
		}
	}

	public setState(state: StepComponentState) {
		this.currentState = state;
		switch (state) {
			case StepComponentState.default:
				this.view.setIsSelected(false);
				this.view.setIsDisabled(false);
				break;
			case StepComponentState.selected:
				this.view.setIsSelected(true);
				this.view.setIsDisabled(false);
				break;
			case StepComponentState.dragging:
				this.view.setIsSelected(false);
				this.view.setIsDisabled(true);
				break;
		}
	}

	public setIsDragging(isDragging: boolean) {
		this.view.setIsDragging(isDragging);
	}

	public validate(): boolean {
		const isValid = this.configuration.validator
			? this.configuration.validator(this.step)
			: true;
		this.view.setIsValid(isValid);
		return isValid && this.view.sequenceComponent.validate();
	}
}

class ContainerStepComponentView implements ComponentView {

	public static create(parent: SVGElement, step: ContainerStep, configuration: StepsConfiguration): ContainerStepComponentView {
		const g = Dom.svg('g');
		parent.appendChild(g);

		const sequenceComponent = SequenceComponent.create(g, step.sequence, configuration);
		Dom.translate(sequenceComponent.view.g, PADDING_X, PADDING_TOP + LABEL_HEIGHT);

		const width = sequenceComponent.view.width + PADDING_X * 2;
		const height = sequenceComponent.view.height + PADDING_TOP + LABEL_HEIGHT;
		const joinX = sequenceComponent.view.joinX + PADDING_X;

		LabelView.create(g, width / 2, PADDING_TOP, step.name);

		const iconUrl = configuration.iconUrlProvider
			? configuration.iconUrlProvider(step.componentType, step.type)
			: null;
		const inputView = InputView.addRectInput(g, width / 2, 0, iconUrl);

		JoinView.createStraightJoin(g, new Vector(width / 2, 0), PADDING_TOP);

		const regionView = RegionView.create(g, [width], height);

		const validationErrorView = ValidationErrorView.create(g, width, 0);

		return new ContainerStepComponentView(g, width, height, joinX, sequenceComponent, inputView, regionView, validationErrorView);
	}

	private constructor(
		public readonly g: SVGGElement,
		public readonly width: number,
		public readonly height: number,
		public readonly joinX: number,
		public readonly sequenceComponent: SequenceComponent,
		private readonly inputView: InputView,
		private readonly regionView: RegionView,
		private readonly validationErrorView: ValidationErrorView) {
	}

	public getClientPosition(): Vector {
		return this.regionView.getClientPosition();
	}

	public containsElement(element: Element): boolean {
		return this.g.contains(element);
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
}
