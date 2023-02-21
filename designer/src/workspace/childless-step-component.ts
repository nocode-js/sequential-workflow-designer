import { Sequence, Step } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { ClickBehavior, ClickDetails, ClickResult, ComponentView, StepComponent } from './component';

export interface ChildlessComponentView extends ComponentView {
	resolveClick(click: ClickDetails): ClickBehavior | null;
	setIsDragging(isDragging: boolean): void;
	setIsSelected(isSelected: boolean): void;
	setIsDisabled(isDisabled: boolean): void;
	setIsValid(isValid: boolean): void;
}

export class ChildlessStepComponent<S extends Step> implements StepComponent {
	public constructor(
		public readonly view: ChildlessComponentView,
		public readonly step: S,
		public readonly parentSequence: Sequence,
		public readonly hasOutput: boolean,
		private readonly configuration: StepsConfiguration
	) {}

	public findByClick(click: ClickDetails): ClickResult | null {
		const action = this.view.resolveClick(click);
		if (action) {
			return {
				component: this,
				action
			};
		}
		return null;
	}

	public findById(stepId: string): StepComponent | null {
		return this.step.id === stepId ? this : null;
	}

	public getPlaceholders() {
		// Nothing...
	}

	public setIsDragging(isDragging: boolean) {
		this.view.setIsDragging(isDragging);
	}

	public setIsDisabled(isDisabled: boolean) {
		this.view.setIsDisabled(isDisabled);
	}

	public setIsSelected(isSelected: boolean) {
		this.view.setIsSelected(isSelected);
	}

	public validate(): boolean {
		const isValid = this.configuration.validator ? this.configuration.validator(this.step, this.parentSequence) : true;
		this.view.setIsValid(isValid);
		return isValid;
	}
}
