import { Sequence, Step } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { ComponentView, StepComponent, StepComponentState } from './component';

export interface ChildlessComponentView extends ComponentView {
	containsElement(element: Element): boolean;
	setIsDragging(isDragging: boolean): void;
	setIsSelected(isSelected: boolean): void;
	setIsDisabled(isDisabled: boolean): void;
	setIsValid(isValid: boolean): void;
}

export class ChildlessStepComponent<S extends Step> implements StepComponent {
	public constructor(
		public readonly view: ChildlessComponentView,
		public readonly isStop: boolean,
		public readonly step: S,
		public readonly parentSequence: Sequence,
		private readonly configuration: StepsConfiguration
	) {}

	public findByElement(element: Element): StepComponent | null {
		return this.view.containsElement(element) ? this : null;
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

	public setState(state: StepComponentState) {
		switch (state) {
			case StepComponentState.default:
				this.view.setIsDisabled(false);
				this.view.setIsSelected(false);
				break;
			case StepComponentState.selected:
				this.view.setIsDisabled(false);
				this.view.setIsSelected(true);
				break;
			case StepComponentState.dragging:
				this.view.setIsDisabled(true);
				this.view.setIsSelected(false);
				break;
		}
	}

	public validate(): boolean {
		const isValid = this.configuration.validator ? this.configuration.validator(this.step) : true;
		this.view.setIsValid(isValid);
		return isValid;
	}
}
