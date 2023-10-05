import { SimpleEvent } from './core/simple-event';
import { isElementAttached } from './core/is-element-attached';
import { Definition, DefinitionWalker, Sequence, Step, StepOrName } from './definition';
import { DesignerConfiguration, UndoStack } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { DesignerView } from './designer-view';
import { DesignerState } from './designer-state';
import { ServicesResolver } from './services';
import { validateConfiguration } from './core/designer-configuration-validator';
import { DesignerApi } from './api';
import { HistoryController } from './history-controller';

export class Designer<TDefinition extends Definition = Definition> {
	/**
	 * Creates a designer.
	 * @param placeholder Placeholder where the designer will be attached.
	 * @param startDefinition Start definition of a flow.
	 * @param configuration Designer's configuration.
	 * @returns An instance of the designer.
	 */
	public static create<TDef extends Definition>(
		placeholder: HTMLElement,
		startDefinition: TDef,
		configuration: DesignerConfiguration<TDef>
	): Designer<TDef> {
		if (!placeholder) {
			throw new Error('Placeholder is not set');
		}
		if (!isElementAttached(placeholder)) {
			throw new Error('Placeholder is not attached to the DOM');
		}
		if (!startDefinition) {
			throw new Error('Start definition is not set');
		}
		if (!configuration) {
			throw new Error('Configuration is not set');
		}
		const config = configuration as DesignerConfiguration;

		validateConfiguration(config);

		const services = ServicesResolver.resolve(configuration.extensions, config);
		const designerContext = DesignerContext.create(placeholder, startDefinition, config, services);
		const designerApi = DesignerApi.create(designerContext);

		const view = DesignerView.create(placeholder, designerContext, designerApi);
		const designer = new Designer<TDef>(
			view,
			designerContext.state,
			designerContext.definitionWalker,
			designerContext.historyController,
			designerApi
		);
		view.workspace.onReady.subscribe(() => designer.onReady.forward());

		designerContext.state.onDefinitionChanged.subscribe(() => {
			setTimeout(() => designer.onDefinitionChanged.forward(designerContext.state.definition as TDef));
		});
		designerContext.state.onSelectedStepIdChanged.subscribe(() =>
			designer.onSelectedStepIdChanged.forward(designerContext.state.selectedStepId)
		);
		designerContext.state.onIsToolboxCollapsedChanged.subscribe(isCollapsed => {
			designer.onIsToolboxCollapsedChanged.forward(isCollapsed);
		});
		designerContext.state.onIsEditorCollapsedChanged.subscribe(isCollapsed => {
			designer.onIsEditorCollapsedChanged.forward(isCollapsed);
		});
		return designer;
	}

	private constructor(
		private readonly view: DesignerView,
		private readonly state: DesignerState,
		private readonly walker: DefinitionWalker,
		private readonly historyController: HistoryController | undefined,
		private readonly api: DesignerApi
	) {}

	/**
	 * @description Fires when the designer is initialized and ready to use.
	 */
	public readonly onReady = new SimpleEvent<void>();

	/**
	 * @description Fires when the definition has changed.
	 */
	public readonly onDefinitionChanged = new SimpleEvent<TDefinition>();

	/**
	 * @description Fires when the selected step has changed.
	 */
	public readonly onSelectedStepIdChanged = new SimpleEvent<string | null>();

	/**
	 * @description Fires when the toolbox is collapsed or expanded.
	 */
	public readonly onIsToolboxCollapsedChanged = new SimpleEvent<boolean>();

	/**
	 * @description Fires when the editor is collapsed or expanded.
	 */
	public readonly onIsEditorCollapsedChanged = new SimpleEvent<boolean>();

	/**
	 * @returns the current definition of the workflow.
	 */
	public getDefinition(): TDefinition {
		return this.state.definition as TDefinition;
	}

	/**
	 * @returns the validation result of the current definition.
	 */
	public isValid(): boolean {
		return this.view.workspace.isValid;
	}

	/**
	 * @returns the readonly flag.
	 */
	public isReadonly(): boolean {
		return this.state.isReadonly;
	}

	/**
	 * @description Changes the readonly flag.
	 */
	public setIsReadonly(isReadonly: boolean) {
		this.state.setIsReadonly(isReadonly);
	}

	/**
	 * @returns current selected step id or `null` if nothing is selected.
	 */
	public getSelectedStepId(): string | null {
		return this.state.selectedStepId;
	}

	/**
	 * @description Selects a step by the id.
	 */
	public selectStepById(stepId: string) {
		this.state.setSelectedStepId(stepId);
	}

	/**
	 * @description Unselects the selected step.
	 */
	public clearSelectedStep() {
		this.state.setSelectedStepId(null);
	}

	/**
	 * @description Moves the viewport to the step with the animation.
	 */
	public moveViewportToStep(stepId: string) {
		this.api.viewport.moveViewportToStep(stepId);
	}

	/**
	 * @deprecated Use `moveViewportToStep` instead.
	 */
	public moveViewPortToStep(stepId: string) {
		this.moveViewportToStep(stepId);
	}

	/**
	 * @description Rerender the root component and all its children.
	 */
	public updateRootComponent() {
		this.api.workspace.updateRootComponent();
	}

	/**
	 * @description Updates all badges.
	 */
	public updateBadges() {
		this.api.workspace.updateBadges();
	}

	/**
	 * @returns a flag that indicates whether the toolbox is collapsed.
	 */
	public isToolboxCollapsed(): boolean {
		return this.state.isToolboxCollapsed;
	}

	/**
	 * @description Sets a flag that indicates whether the toolbox is collapsed.
	 */
	public setIsToolboxCollapsed(isCollapsed: boolean) {
		this.state.setIsToolboxCollapsed(isCollapsed);
	}

	/**
	 * @returns a flag that indicates whether the editor is collapsed.
	 */
	public isEditorCollapsed(): boolean {
		return this.state.isEditorCollapsed;
	}

	/**
	 * @description Sets a flag that indicates whether the editor is collapsed.
	 */
	public setIsEditorCollapsed(isCollapsed: boolean) {
		this.state.setIsEditorCollapsed(isCollapsed);
	}

	/**
	 * @description Dump the undo stack.
	 */
	public dumpUndoStack(): UndoStack {
		if (!this.historyController) {
			throw new Error('Undo feature is not activated');
		}
		return this.historyController.dump();
	}

	/**
	 * @param needle A step, a sequence or a step id.
	 * @returns parent steps and branch names.
	 */
	public getStepParents(needle: Sequence | Step | string): StepOrName[] {
		return this.walker.getParents(this.state.definition, needle);
	}

	/**
	 * @description Destroys the designer and deletes all nodes from the placeholder.
	 */
	public destroy() {
		this.view.destroy();
	}
}
