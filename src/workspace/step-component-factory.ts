import { ComponentType, Sequence, Step, SwitchStep, TaskStep } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { StepComponent } from './component';
import { SwitchStepComponent } from './switch-step-component';
import { TaskStepComponent } from './task-step-component';

export class StepComponentFactory {

	public static create(step: Step, parentSequence: Sequence, configuration: StepsConfiguration): StepComponent {
		switch (step.componentType) {
			case ComponentType.task:
				return TaskStepComponent.create(step as TaskStep, parentSequence, configuration);
			case ComponentType.switch:
				return SwitchStepComponent.create(step as SwitchStep, parentSequence, configuration);
			default:
				throw new Error(`Unknown component type: ${step.componentType}`);
		}
	}
}
