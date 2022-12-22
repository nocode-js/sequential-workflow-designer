import { Sequence, TaskStep } from '../../definition';
import { ChildlessStepComponent } from '../childless-step-component';
import { ComponentContext } from '../component-context';
import { TaskStepComponentView } from './task-step-component-view';

export class TaskStepComponent {
	public static create(
		parent: SVGElement,
		step: TaskStep,
		parentSequence: Sequence,
		context: ComponentContext
	): ChildlessStepComponent<TaskStep> {
		const view = TaskStepComponentView.create(parent, false, step, context.configuration);
		return new ChildlessStepComponent(view, false, step, parentSequence, context.configuration);
	}
}
