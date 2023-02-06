import { TaskStep } from '../../definition';
import { StepChildren, StepExtension } from '../../designer-extension';
import { TaskStepComponent } from './task-step-component';

export class TaskStepExtension implements StepExtension<TaskStep> {
	public readonly componentType = 'task';

	public readonly createComponent = TaskStepComponent.create;

	public getChildren(): StepChildren | null {
		return null;
	}
}
