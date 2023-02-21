import { TaskStep } from '../../definition';
import { ChildlessStepComponent } from '../childless-step-component';
import { ComponentContext } from '../../component-context';
import { TaskStepComponentView } from './task-step-component-view';
import { StepContext } from '../../designer-extension';

export class TaskStepComponent {
	public static create(
		parent: SVGElement,
		stepContext: StepContext<TaskStep>,
		context: ComponentContext
	): ChildlessStepComponent<TaskStep> {
		const view = TaskStepComponentView.create(parent, stepContext, context.configuration, false);
		return new ChildlessStepComponent(view, stepContext.step, stepContext.parentSequence, true, context.configuration);
	}
}
