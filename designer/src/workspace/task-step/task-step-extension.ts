import { ComponentContext } from '../../component-context';
import { Step } from '../../definition';
import { StepChildren, StepExtension, StepContext } from '../../designer-extension';
import { TaskStepComponentView } from './task-step-component-view';
import { TaskStepExtensionConfiguration } from './task-step-extension-configuration';

const defaultConfiguration: TaskStepExtensionConfiguration = {
	view: {
		paddingX: 12,
		paddingY: 10,
		textMarginLeft: 12,
		minTextWidth: 70,
		iconSize: 22,
		radius: 5,
		inputSize: 14,
		outputSize: 10
	}
};

export class TaskStepExtension implements StepExtension<Step> {
	public static create(configuration?: TaskStepExtensionConfiguration): TaskStepExtension {
		return new TaskStepExtension(configuration ?? defaultConfiguration);
	}

	public readonly componentType = 'task';

	private constructor(private readonly configuration: TaskStepExtensionConfiguration) {}

	public createComponentView(
		parentElement: SVGElement,
		stepContext: StepContext<Step>,
		componentContext: ComponentContext
	): TaskStepComponentView {
		return TaskStepComponentView.create(parentElement, stepContext, false, componentContext, this.configuration.view);
	}

	public getChildren(): StepChildren | null {
		return null;
	}
}
