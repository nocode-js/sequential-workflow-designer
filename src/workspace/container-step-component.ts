import { ContainerStep, Sequence, Step } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { Placeholder, StepComponent, StepComponentState } from './component';
import { ContainerStepComponentView } from './views/container-step-component-view';

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
