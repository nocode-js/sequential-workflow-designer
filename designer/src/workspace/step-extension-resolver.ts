import { ComponentType, Step } from '../definition';
import { StepExtension } from '../designer-extension';
import { Services } from '../services';

type StepExtensionDictionary = Record<string, StepExtension>;

export class StepExtensionResolver {
	public static create(services: Services): StepExtensionResolver {
		const dict: StepExtensionDictionary = {};
		for (let i = services.steps.length - 1; i >= 0; i--) {
			const extension = services.steps[i];
			dict[extension.componentType] = extension;
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
