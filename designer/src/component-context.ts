import { DefinitionWalker } from 'sequential-workflow-model';
import { DefinitionValidator } from './core/definition-validator';
import { IconProvider } from './core/icon-provider';
import { DesignerConfiguration, I18n, PreferenceStorage } from './designer-configuration';
import { DesignerState } from './designer-state';
import { Services } from './services';
import { StepComponentFactory } from './workspace/step-component-factory';
import { StepExtensionResolver } from './workspace/step-extension-resolver';
import { PlaceholderController } from './workspace/placeholder/placeholder-controller';

export class ComponentContext {
	public static create(
		configuration: DesignerConfiguration,
		state: DesignerState,
		stepExtensionResolver: StepExtensionResolver,
		placeholderController: PlaceholderController,
		definitionWalker: DefinitionWalker,
		preferenceStorage: PreferenceStorage,
		i18n: I18n,
		services: Services
	): ComponentContext {
		const validator = new DefinitionValidator(configuration.validator, state);
		const iconProvider = new IconProvider(configuration.steps);
		const stepComponentFactory = new StepComponentFactory(stepExtensionResolver);
		return new ComponentContext(
			configuration.shadowRoot,
			validator,
			iconProvider,
			placeholderController,
			stepComponentFactory,
			definitionWalker,
			services,
			preferenceStorage,
			i18n,
			state
		);
	}

	private constructor(
		public readonly shadowRoot: ShadowRoot | undefined,
		public readonly validator: DefinitionValidator,
		public readonly iconProvider: IconProvider,
		public readonly placeholderController: PlaceholderController,
		public readonly stepComponentFactory: StepComponentFactory,
		public readonly definitionWalker: DefinitionWalker,
		public readonly services: Services,
		public readonly preferenceStorage: PreferenceStorage,
		public readonly i18n: I18n,
		private readonly state: DesignerState
	) {}

	public getViewportScale(): number {
		return this.state.viewport.scale;
	}
}
