import { StepExtension, StepsConfiguration } from '../designer-configuration';
import { StepComponentFactory } from './step-component-factory';

export type StepExtensionDictionary = Record<string, StepExtension>;

export class ComponentContext {
	public static create(configuration: StepsConfiguration, stepExtensions: StepExtensionDictionary): ComponentContext {
		return new ComponentContext(configuration, new StepComponentFactory(stepExtensions));
	}

	private constructor(public readonly configuration: StepsConfiguration, public readonly stepComponentFactory: StepComponentFactory) {}
}
