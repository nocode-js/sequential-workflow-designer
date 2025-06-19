import { BehaviorController } from './behaviors/behavior-controller';
import { ComponentContext } from './component-context';
import { ObjectCloner } from './core/object-cloner';
import { CustomActionController } from './custom-action-controller';
import { Definition, DefinitionWalker } from './definition';
import { StateModifier } from './modifier/state-modifier';
import { DesignerConfiguration, I18n, UidGenerator } from './designer-configuration';
import { DesignerState } from './designer-state';
import { HistoryController } from './history-controller';
import { LayoutController } from './layout-controller';
import { Services } from './services';
import { StepExtensionResolver } from './workspace/step-extension-resolver';
import { WorkspaceController, WorkspaceControllerWrapper } from './workspace/workspace-controller';
import { MemoryPreferenceStorage } from './core/memory-preference-storage';
import { PlaceholderController } from './workspace/placeholder/placeholder-controller';
import { Uid } from './core';

export class DesignerContext {
	public static create(
		placeholder: HTMLElement,
		startDefinition: Definition,
		configuration: DesignerConfiguration,
		services: Services
	): DesignerContext {
		const definition = ObjectCloner.deepClone(startDefinition);

		const layoutController = new LayoutController(placeholder);
		const isReadonly = Boolean(configuration.isReadonly);

		const isToolboxCollapsed = configuration.toolbox ? configuration.toolbox.isCollapsed ?? layoutController.isMobile() : false;
		const isEditorCollapsed = configuration.editors ? configuration.editors.isCollapsed ?? layoutController.isMobile() : false;

		const theme = configuration.theme || 'light';
		const state = new DesignerState(definition, isReadonly, isToolboxCollapsed, isEditorCollapsed);
		const workspaceController = new WorkspaceControllerWrapper();
		const behaviorController = BehaviorController.create(configuration.shadowRoot);
		const stepExtensionResolver = StepExtensionResolver.create(services);
		const placeholderController = PlaceholderController.create(configuration.placeholder);
		const definitionWalker = configuration.definitionWalker ?? new DefinitionWalker();
		const i18n: I18n = configuration.i18n ?? ((_, defaultValue) => defaultValue);
		const uidGenerator = configuration.uidGenerator ?? Uid.next;
		const stateModifier = StateModifier.create(definitionWalker, uidGenerator, state, configuration.steps);
		const customActionController = new CustomActionController(configuration, state, stateModifier);

		let historyController: HistoryController | undefined = undefined;
		if (configuration.undoStackSize) {
			historyController = HistoryController.create(configuration.undoStack, state, stateModifier, configuration);
		}

		const preferenceStorage = configuration.preferenceStorage ?? new MemoryPreferenceStorage();
		const componentContext = ComponentContext.create(
			configuration,
			state,
			stepExtensionResolver,
			placeholderController,
			definitionWalker,
			preferenceStorage,
			i18n,
			services
		);

		return new DesignerContext(
			theme,
			state,
			configuration,
			services,
			componentContext,
			definitionWalker,
			i18n,
			uidGenerator,
			stateModifier,
			layoutController,
			workspaceController,
			placeholderController,
			behaviorController,
			customActionController,
			historyController
		);
	}

	public constructor(
		public readonly theme: string,
		public readonly state: DesignerState,
		public readonly configuration: DesignerConfiguration,
		public readonly services: Services,
		public readonly componentContext: ComponentContext,
		public readonly definitionWalker: DefinitionWalker,
		public readonly i18n: I18n,
		public readonly uidGenerator: UidGenerator,
		public readonly stateModifier: StateModifier,
		public readonly layoutController: LayoutController,
		public readonly workspaceController: WorkspaceControllerWrapper,
		public readonly placeholderController: PlaceholderController,
		public readonly behaviorController: BehaviorController,
		public readonly customActionController: CustomActionController,
		public readonly historyController: HistoryController | undefined
	) {}

	public setWorkspaceController(controller: WorkspaceController) {
		this.workspaceController.set(controller);
	}
}
