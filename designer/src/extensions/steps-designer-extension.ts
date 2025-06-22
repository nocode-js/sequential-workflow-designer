import { Step } from '../definition';
import { DesignerExtension, StepExtension } from '../designer-extension';
import { ContainerStepExtension } from '../workspace/container-step/container-step-extension';
import { ContainerStepExtensionConfiguration } from '../workspace/container-step/container-step-extension-configuration';
import { SwitchStepExtensionConfiguration } from '../workspace/switch-step/switch-step-extension-configuration';
import { SwitchStepExtension } from '../workspace/switch-step/switch-step-extension';
import { TaskStepExtensionConfiguration } from '../workspace/task-step/task-step-extension-configuration';
import { TaskStepExtension } from '../workspace/task-step/task-step-extension';
import { LaunchPadStepExtensionConfiguration } from '../workspace/launch-pad-step/launch-pad-step-extension-configuration';
import { LaunchPadStepExtension } from '../workspace/launch-pad-step/launch-pad-step-extension';

export interface StepsDesignerExtensionConfiguration {
	container?: ContainerStepExtensionConfiguration;
	switch?: SwitchStepExtensionConfiguration;
	task?: TaskStepExtensionConfiguration;
	launchPad?: LaunchPadStepExtensionConfiguration;
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
		if (configuration.launchPad) {
			steps.push(LaunchPadStepExtension.create(configuration.launchPad));
		}
		return new StepsDesignerExtension(steps);
	}

	protected constructor(public readonly steps: StepExtension<Step>[]) {}
}
