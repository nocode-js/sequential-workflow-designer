import { SequentialStep, Sequence, Step } from '../../definition';
import { StepsConfiguration } from '../../designer-configuration';
import { ClickBehaviorType, ClickDetails, ClickResult, Placeholder, StepComponent } from '../component';
import { ComponentContext } from '../../component-context';
import { ContainerStepComponentView } from './container-step-component-view';
import { StepContext } from '../../designer-extension';

export class ContainerStepComponent implements StepComponent {
	public static create(
		parentElement: SVGElement,
		stepContext: StepContext<SequentialStep>,
		componentContext: ComponentContext
	): ContainerStepComponent {
		const view = ContainerStepComponentView.create(parentElement, stepContext, componentContext);
		return new ContainerStepComponent(
			view,
			stepContext.step,
			stepContext.parentSequence,
			view.hasOutput(),
			componentContext.configuration
		);
	}

	private isDisabled = false;

	private constructor(
		public readonly view: ContainerStepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence,
		public readonly hasOutput: boolean,
		private readonly configuration: StepsConfiguration
	) {}

	public findByClick(click: ClickDetails): ClickResult | null {
		const result = this.view.sequenceComponent.findByClick(click);
		if (result) {
			return result;
		}
		if (this.view.resolveClick(click)) {
			return {
				component: this,
				action: {
					type: ClickBehaviorType.selectStep
				}
			};
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
		if (!this.isDisabled) {
			this.view.sequenceComponent.getPlaceholders(result);
		}
	}

	public setIsSelected(isSelected: boolean) {
		this.view.setIsSelected(isSelected);
	}

	public setIsDisabled(isDisabled: boolean) {
		this.isDisabled = isDisabled;
		this.view.setIsDisabled(isDisabled);
	}

	public setIsDragging(isDragging: boolean) {
		this.view.setIsDragging(isDragging);
	}

	public validate(): boolean {
		const isValid = this.configuration.validator ? this.configuration.validator(this.step, this.parentSequence) : true;
		this.view.setIsValid(isValid);
		const isSequenceValid = this.view.sequenceComponent.validate();
		return isValid && isSequenceValid;
	}
}
