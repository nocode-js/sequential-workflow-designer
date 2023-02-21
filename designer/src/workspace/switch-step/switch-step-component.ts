import { Sequence, Step, SwitchStep } from '../../definition';
import { StepsConfiguration } from '../../designer-configuration';
import { ClickBehaviorType, ClickDetails, ClickResult, Placeholder, StepComponent } from '../component';
import { ComponentContext } from '../../component-context';
import { SwitchStepComponentView } from './switch-step-component-view';
import { StepContext } from '../../designer-extension';

export class SwitchStepComponent implements StepComponent {
	public static create(parentElement: SVGElement, stepContext: StepContext<SwitchStep>, context: ComponentContext): SwitchStepComponent {
		const view = SwitchStepComponentView.create(parentElement, stepContext, context);
		return new SwitchStepComponent(view, stepContext.step, stepContext.parentSequence, view.hasOutput(), context.configuration);
	}

	private isDisabled = false;

	private constructor(
		public readonly view: SwitchStepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence,
		public readonly hasOutput: boolean,
		private readonly configuration: StepsConfiguration
	) {}

	public findByClick(click: ClickDetails): ClickResult | null {
		for (const sequence of this.view.sequenceComponents) {
			const result = sequence.findByClick(click);
			if (result) {
				return result;
			}
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
		if (this.step.id === stepId) {
			return this;
		}
		for (const sequence of this.view.sequenceComponents) {
			const sc = sequence.findById(stepId);
			if (sc) {
				return sc;
			}
		}
		return null;
	}

	public getPlaceholders(result: Placeholder[]) {
		if (!this.isDisabled) {
			this.view.sequenceComponents.forEach(sc => sc.getPlaceholders(result));
		}
	}

	public setIsDragging(isDragging: boolean) {
		if (!this.isDisabled) {
			this.view.sequenceComponents.forEach(s => s.setIsDragging(isDragging));
		}
		this.view.setIsDragging(isDragging);
	}

	public setIsDisabled(isDisabled: boolean): void {
		this.isDisabled = isDisabled;
		this.view.setIsDisabled(isDisabled);
	}

	public setIsSelected(isSelected: boolean): void {
		this.view.setIsSelected(isSelected);
	}

	public validate(): boolean {
		const isValid = this.configuration.validator ? this.configuration.validator(this.step, this.parentSequence) : true;
		this.view.setIsValid(isValid);

		let areChildrenValid = true;
		for (const component of this.view.sequenceComponents) {
			areChildrenValid = component.validate() && areChildrenValid;
		}
		return isValid && areChildrenValid;
	}
}
