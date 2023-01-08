import { StepsConfiguration } from '../designer-configuration';
import { StepComponentFactory } from './step-component-factory';
import { StepExtensionResolver } from './step-extension-resolver';

export class ComponentContext {
	public static create(configuration: StepsConfiguration, stepExtensionResolver: StepExtensionResolver): ComponentContext {
		return new ComponentContext(configuration, new StepComponentFactory(stepExtensionResolver));
	}

	private constructor(public readonly configuration: StepsConfiguration, public readonly stepComponentFactory: StepComponentFactory) {}
}
