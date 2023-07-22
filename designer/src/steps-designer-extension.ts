import { Step } from './definition';
import { DesignerExtension, StepExtension } from './designer-extension';
import { ContainerStepExtension } from './workspace/container-step/container-step-extension';
import { ContainerStepExtensionConfiguration } from './workspace/container-step/container-step-extension-configuration';
import { SwitchStepExtensionConfiguration } from './workspace/switch-step/switch-step-extension-configuration';
import { SwitchStepExtension } from './workspace/switch-step/switch-step-extension';
import { TaskStepExtensionConfiguration } from './workspace/task-step/task-step-extension-configuration';
import { TaskStepExtension } from './workspace/task-step/task-step-extension';

export interface StepsDesignerExtensionConfiguration {
	container?: ContainerStepExtensionConfiguration;
	switch?: SwitchStepExtensionConfiguration;
	task?: TaskStepExtensionConfiguration;
}

export class StepsDesignerExtension implements DesignerExtension {
	public static create(configuration: StepsDesignerExtensionConfiguration): StepsDesignerExtension {
		const steps: StepExtension<Step>[] = [];
		if (configuration.container) {
			steps.push(ContainerStepExtension.create(configuration.container));
		}
		if (configuration.switch) {
			steps.push(SwitchStepExtension.create(configuration.switch));
		}
		if (configuration.task) {
			steps.push(TaskStepExtension.create(configuration.task));
		}
		return new StepsDesignerExtension(steps);
	}

	protected constructor(public readonly steps: StepExtension<Step>[]) {}
}

/**
 * @deprecated Use `StepsDesignerExtension` instead.
 */
export class StepsExtension extends StepsDesignerExtension {}

/**
 * @deprecated Use `StepsDesignerExtensionConfiguration` instead.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface StepsExtensionConfiguration extends StepsDesignerExtensionConfiguration {}
