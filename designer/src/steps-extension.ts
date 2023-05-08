import { Step } from 'sequential-workflow-model';
import { DesignerExtension, StepExtension } from './designer-extension';
import { ContainerStepExtension } from './workspace/container-step/container-step-extension';
import { ContainerStepExtensionConfiguration } from './workspace/container-step/container-step-extension-configuration';
import { SwitchStepExtensionConfiguration } from './workspace/switch-step/switch-step-extension-configuration';
import { SwitchStepExtension } from './workspace/switch-step/switch-step-extension';
import { TaskStepExtensionConfiguration } from './workspace/task-step/task-step-extension-configuration';
import { TaskStepExtension } from './workspace/task-step/task-step-extension';

export interface StepsExtensionConfiguration {
	container?: ContainerStepExtensionConfiguration;
	switch?: SwitchStepExtensionConfiguration;
	task?: TaskStepExtensionConfiguration;
}

export class StepsExtension implements DesignerExtension {
	public static create(configuration: StepsExtensionConfiguration): StepsExtension {
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
		return new StepsExtension(steps);
	}

	private constructor(public readonly steps: StepExtension<Step>[]) {}
}
