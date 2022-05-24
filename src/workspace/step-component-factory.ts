import { Sequence, Step, StepType, SwitchStep, TaskStep } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { StepComponent } from './component';
import { SwitchStepComponent } from './switch-step-component';
import { TaskStepComponent } from './task-step-component';

export class StepComponentFactory {

	public static create(step: Step, parentSequence: Sequence, configuration: DesignerConfiguration): StepComponent {
		switch (step.type) {
			case StepType.task:
				return TaskStepComponent.create(step as TaskStep, parentSequence, configuration);
			case StepType.switch:
				return SwitchStepComponent.create(step as SwitchStep, parentSequence, configuration);
			default:
				throw new Error('Unknown step');
		}
	}
}
