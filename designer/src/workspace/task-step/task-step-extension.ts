import { ComponentContext } from '../../component-context';
import { Step } from '../../definition';
import { StepChildren, StepExtension, StepContext } from '../../designer-extension';
import { TaskStepComponentView } from './task-step-component-view';

export class TaskStepExtension implements StepExtension<Step> {
	public readonly componentType = 'task';

	public createComponentView(
		parentElement: SVGElement,
		stepContext: StepContext<Step>,
		componentContext: ComponentContext
	): TaskStepComponentView {
		return TaskStepComponentView.create(parentElement, stepContext, componentContext.configuration, false);
	}

	public getChildren(): StepChildren | null {
		return null;
	}
}
