import { Sequence, Step, SwitchStep } from '../../definition';
import { StepsConfiguration } from '../../designer-configuration';
import { ClickBehaviorType, ClickDetails, ClickResult, Placeholder, StepComponent, StepComponentState } from '../component';
import { ComponentContext } from '../component-context';
import { SwitchStepComponentView } from './switch-step-component-view';

export class SwitchStepComponent implements StepComponent {
	public static create(
		parentElement: SVGElement,
		step: SwitchStep,
		parentSequence: Sequence,
		context: ComponentContext
	): SwitchStepComponent {
		const view = SwitchStepComponentView.create(parentElement, step, context);
		return new SwitchStepComponent(view, step, parentSequence, view.isInterrupted(), context.configuration);
	}

	private currentState = StepComponentState.default;

	private constructor(
		public readonly view: SwitchStepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence,
		public readonly isInterrupted: boolean,
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
		if (this.currentState !== StepComponentState.dragging) {
			this.view.sequenceComponents.forEach(sc => sc.getPlaceholders(result));
		}
	}

	public setIsDragging(isDragging: boolean) {
		if (this.currentState !== StepComponentState.dragging) {
			this.view.sequenceComponents.forEach(s => s.setIsDragging(isDragging));
		}
		this.view.setIsDragging(isDragging);
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

	public validate(): boolean {
		const isValid = this.configuration.validator ? this.configuration.validator(this.step) : true;
		this.view.setIsValid(isValid);

		let areChildrenValid = true;
		for (const component of this.view.sequenceComponents) {
			areChildrenValid = component.validate() && areChildrenValid;
		}
		return isValid && areChildrenValid;
	}
}
