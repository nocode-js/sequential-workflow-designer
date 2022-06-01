import { Sequence, Step, SwitchStep } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { Placeholder, StepComponent, StepComponentState } from './component';
import { SwitchStepComponentView } from './views/switch-step-component-view';

export class SwitchStepComponent implements StepComponent {

	public static create(parent: SVGElement, step: SwitchStep, parentSequence: Sequence, configuration: StepsConfiguration): SwitchStepComponent {
		const view = SwitchStepComponentView.create(parent, step, configuration);
		return new SwitchStepComponent(view, step, parentSequence, configuration);
	}

	private currentState = StepComponentState.default;

	private constructor(
		public readonly view: SwitchStepComponentView,
		public readonly step: Step,
		public readonly parentSequence: Sequence,
		private readonly configuration: StepsConfiguration) {
	}

	public findByElement(element: Element): StepComponent | null {
		for (const sequence of this.view.sequenceComponents) {
			const sc = sequence.findByElement(element);
			if (sc) {
				return sc;
			}
		}
		if (this.view.containsElement(element)) {
			return this;
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
		const isValid = this.configuration.validator
			? this.configuration.validator(this.step)
			: true;
		this.view.setIsValid(isValid);
		const isChildrenValid = this.view.sequenceComponents.every(c => c.validate());
		return isValid && isChildrenValid;
	}
}
