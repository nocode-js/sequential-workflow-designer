import { BehaviorController } from './behaviors/behavior-controller';
import { ComponentContext } from './component-context';
import { ObjectCloner } from './core/object-cloner';
import { StepsTraverser } from './core/steps-traverser';
import { Definition } from './definition';
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

		const state = new DesignerState(definition, isReadonly);
		const workspaceController = new WorkspaceControllerWrapper();
		const behaviorController = new BehaviorController();
		const stepExtensionResolver = StepExtensionResolver.create(services);
		const stepsTraverser = new StepsTraverser(stepExtensionResolver);
		const definitionModifier = new DefinitionModifier(stepsTraverser, state, configuration);

		let historyController: HistoryController | undefined = undefined;
		if (configuration.undoStackSize) {
			historyController = HistoryController.create(state, definitionModifier, configuration);
		}

		const componentContext = ComponentContext.create(configuration.steps, stepExtensionResolver, services);

		return new DesignerContext(
			state,
			configuration,
			services,
			componentContext,
			stepsTraverser,
			definitionModifier,
			layoutController,
			workspaceController,
			behaviorController,
			historyController
		);
	}

	public constructor(
		public readonly state: DesignerState,
		public readonly configuration: DesignerConfiguration,
		public readonly services: Services,
		public readonly componentContext: ComponentContext,
		public readonly stepsTraverser: StepsTraverser,
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
