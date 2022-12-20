import { Sequence, Step, TaskStep } from '../../definition';
import { StepsConfiguration } from '../../designer-configuration';
import { StepComponent, StepComponentState } from '../component';
import { ComponentContext } from '../component-context';
import { TaskStepComponentView } from './task-step-component-view';

export class TaskStepComponent implements StepComponent {
	public static create(parent: SVGElement, step: TaskStep, parentSequence: Sequence, context: ComponentContext): TaskStepComponent {
		const view = TaskStepComponentView.create(parent, step, context.configuration);
		return new TaskStepComponent(view, step, parentSequence, context.configuration);
	}

	private constructor(
		public readonly view: TaskStepComponentView,
		public readonly step: Step,
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
		// Nothing to do here.
	}

	public setIsDragging(isDragging: boolean) {
		this.view.setIsDragging(isDragging);
	}

	public setState(state: StepComponentState) {
		switch (state) {
			case StepComponentState.default:
				this.view.setIsSelected(false);
				this.view.setIsDisabled(false);
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
