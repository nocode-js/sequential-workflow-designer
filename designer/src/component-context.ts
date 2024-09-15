import { DefinitionWalker } from 'sequential-workflow-model';
import { DefinitionValidator } from './core/definition-validator';
import { IconProvider } from './core/icon-provider';
import { DesignerConfiguration, I18n, PreferenceStorage } from './designer-configuration';
import { PlaceholderController } from './designer-extension';
import { DesignerState } from './designer-state';
import { Services } from './services';
import { StepComponentFactory } from './workspace/step-component-factory';
import { StepExtensionResolver } from './workspace/step-extension-resolver';

export class ComponentContext {
	public static create(
		documentOrShadowRoot: Document | ShadowRoot,
		documentBody: Node,
		configuration: DesignerConfiguration,
		state: DesignerState,
		stepExtensionResolver: StepExtensionResolver,
		definitionWalker: DefinitionWalker,
		preferenceStorage: PreferenceStorage,
		placeholderController: PlaceholderController,
		i18n: I18n,
		services: Services
	): ComponentContext {
		const validator = new DefinitionValidator(configuration.validator, state);
		const iconProvider = new IconProvider(configuration.steps);
		const stepComponentFactory = new StepComponentFactory(stepExtensionResolver);
		return new ComponentContext(
			documentOrShadowRoot,
			documentBody,
			validator,
			iconProvider,
			placeholderController,
			stepComponentFactory,
			definitionWalker,
			services,
			preferenceStorage,
			i18n
		);
	}

	private constructor(
		public readonly documentOrShadowRoot: Document | ShadowRoot,
		public readonly documentBody: Node,
		public readonly validator: DefinitionValidator,
		public readonly iconProvider: IconProvider,
		public readonly placeholderController: PlaceholderController,
		public readonly stepComponentFactory: StepComponentFactory,
		public readonly definitionWalker: DefinitionWalker,
		public readonly services: Services,
		public readonly preferenceStorage: PreferenceStorage,
		public readonly i18n: I18n
	) {}
}
