import { ComponentType, ContainerStep, Sequence, Step, SwitchStep, TaskStep } from '../definition';
import { StepsConfiguration } from '../designer-configuration';
import { StepComponent } from './component';
import { ContainerStepComponent } from './container-step-component';
import { SwitchStepComponent } from './switch-step-component';
import { TaskStepComponent } from './task-step-component';

export class StepComponentFactory {

	public static create(parent: SVGElement, step: Step, parentSequence: Sequence, configuration: StepsConfiguration): StepComponent {
		switch (step.componentType) {
			case ComponentType.task:
				return TaskStepComponent.create(parent, step as TaskStep, parentSequence, configuration);
			case ComponentType.switch:
				return SwitchStepComponent.create(parent, step as SwitchStep, parentSequence, configuration);
			case ComponentType.container:
				return ContainerStepComponent.create(parent, step as ContainerStep, parentSequence, configuration);
			default:
				throw new Error(`Unknown component type: ${step.componentType}`);
		}
	}
}
