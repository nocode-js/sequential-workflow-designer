import { BehaviorController } from './behaviors/behavior-controller';
import { ComponentContext } from './component-context';
import { ObjectCloner } from './core/object-cloner';
import { Definition, DefinitionWalker } from './definition';
import { DefinitionModifier } from './definition-modifier';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerState } from './designer-state';
import { HistoryController } from './history-controller';
import { LayoutController } from './layout-controller';
import { Services } from './services';
import { StepExtensionResolver } from './workspace/step-extension-resolver';
import { WorkspaceController, WorkspaceControllerWrapper } from './workspace/workspace-controller';

export class DesignerContext {
	public static create(
		parent: HTMLElement,
		startDefinition: Definition,
		configuration: DesignerConfiguration,
		services: Services
	): DesignerContext {
		const definition = ObjectCloner.deepClone(startDefinition);

		const layoutController = new LayoutController(parent);
		const isReadonly = !!configuration.isReadonly;

		const isToolboxCollapsed = configuration.toolbox ? configuration.toolbox.isCollapsed ?? layoutController.isMobile() : false;
		const isEditorCollapsed = configuration.editors ? configuration.editors.isCollapsed ?? layoutController.isMobile() : false;

		const theme = configuration.theme || 'light';
		const state = new DesignerState(definition, isReadonly, isToolboxCollapsed, isEditorCollapsed);
		const workspaceController = new WorkspaceControllerWrapper();
		const behaviorController = new BehaviorController();
		const stepExtensionResolver = StepExtensionResolver.create(services);
		const definitionWalker = configuration.definitionWalker ?? new DefinitionWalker();
		const definitionModifier = new DefinitionModifier(definitionWalker, state, configuration);

		let historyController: HistoryController | undefined = undefined;
		if (configuration.undoStackSize) {
			historyController = HistoryController.create(configuration.undoStack, state, definitionModifier, configuration);
		}

		const componentContext = ComponentContext.create(
			configuration.steps,
			configuration.validator,
			state,
			stepExtensionResolver,
			services
		);

		return new DesignerContext(
			theme,
			state,
			configuration,
			services,
			componentContext,
			definitionWalker,
			definitionModifier,
			layoutController,
			workspaceController,
			behaviorController,
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
		public readonly definitionModifier: DefinitionModifier,
		public readonly layoutController: LayoutController,
		public readonly workspaceController: WorkspaceControllerWrapper,
		public readonly behaviorController: BehaviorController,
		public readonly historyController: HistoryController | undefined
	) {}

	public setWorkspaceController(controller: WorkspaceController) {
		this.workspaceController.set(controller);
	}
}
