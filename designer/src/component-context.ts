import { StepsConfiguration } from './designer-configuration';
import { PlaceholderController } from './designer-extension';
import { Services } from './services';
import { StepComponentFactory } from './workspace/step-component-factory';
import { StepExtensionResolver } from './workspace/step-extension-resolver';

export class ComponentContext {
	public static create(
		configuration: StepsConfiguration,
		stepExtensionResolver: StepExtensionResolver,
		services: Services
	): ComponentContext {
		const placeholderController = services.placeholderController.create();
		const stepComponentFactory = new StepComponentFactory(stepExtensionResolver);
		return new ComponentContext(configuration, placeholderController, stepComponentFactory, services);
	}

	private constructor(
		public readonly configuration: StepsConfiguration,
		public readonly placeholderController: PlaceholderController,
		public readonly stepComponentFactory: StepComponentFactory,
		public readonly services: Services
	) {}
}
