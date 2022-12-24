import { DesignerExtension, StepExtension } from '../designer-configuration';
import { ContainerStepExtension } from './container-step/container-step-extension';
import { SwitchStepExtension } from './switch-step/switch-step-extension';
import { TaskStepExtension } from './task-step/task-step-extension';

export type StepExtensionDictionary = Record<string, StepExtension>;

export class StepExtensionsResolver {
	public static resolve(extensions: DesignerExtension[] | undefined): StepExtensionDictionary {
		const exts: StepExtensionDictionary = {};
		exts['task'] = new TaskStepExtension();
		exts['switch'] = new SwitchStepExtension();
		exts['container'] = new ContainerStepExtension();
		if (extensions) {
			for (const extension of extensions) {
				extension.steps.forEach(stepExt => (exts[stepExt.componentType] = stepExt));
			}
		}
		return exts;
	}
}
