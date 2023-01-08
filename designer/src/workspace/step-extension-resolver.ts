import { ComponentType, Step } from '../definition';
import { DesignerExtension, StepExtension } from '../designer-configuration';
import { ContainerStepExtension } from './container-step/container-step-extension';
import { SwitchStepExtension } from './switch-step/switch-step-extension';
import { TaskStepExtension } from './task-step/task-step-extension';

type StepExtensionDictionary = Record<string, StepExtension>;

export class StepExtensionResolver {
	public static create(extensions: DesignerExtension[] | undefined): StepExtensionResolver {
		const dict: StepExtensionDictionary = {};
		dict['task'] = new TaskStepExtension();
		dict['switch'] = new SwitchStepExtension();
		dict['container'] = new ContainerStepExtension();
		if (extensions) {
			for (const extension of extensions) {
				extension.steps.forEach(stepExt => (dict[stepExt.componentType] = stepExt));
			}
		}
		return new StepExtensionResolver(dict);
	}

	private constructor(private readonly dict: StepExtensionDictionary) {}

	public resolve(componentType: ComponentType): StepExtension<Step> {
		const extension = this.dict[componentType];
		if (!extension) {
			throw new Error(`Not supported component type: ${componentType}`);
		}
		return extension;
	}
}
