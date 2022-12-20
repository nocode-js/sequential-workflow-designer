import { StepExtension, StepsConfiguration } from '../designer-configuration';
import { ContainerStepExtension } from './container-step/container-step-extension';
import { SwitchStepExtension } from './switch-step/switch-step-extension';
import { TaskStepExtension } from './task-step/task-step-extension';

export type StepExtensionDictionary = Record<string, StepExtension>;

export class StepExtensionsResolver {
	public static resolve(configuration: StepsConfiguration): StepExtensionDictionary {
		const exts: StepExtensionDictionary = {};
		exts['task'] = new TaskStepExtension();
		exts['switch'] = new SwitchStepExtension();
		exts['container'] = new ContainerStepExtension();
		if (configuration.extensions) {
			configuration.extensions.forEach(ext => (exts[ext.componentType] = ext));
		}
		return exts;
	}
}
