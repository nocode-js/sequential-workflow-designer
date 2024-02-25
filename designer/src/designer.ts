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
import { Viewport } from './designer-extension';
import { race } from './core';
import { StateModifier } from './modifier/state-modifier';

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
			throw new Error('Placeholder is not defined');
		}
		if (!isElementAttached(placeholder)) {
			throw new Error('Placeholder is not attached to the DOM');
		}
		if (!startDefinition) {
			throw new Error('Start definition is not defined');
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
			designerContext.stateModifier,
			designerContext.definitionWalker,
			designerContext.historyController,
			designerApi
		);
		view.workspace.onRendered.first().then(designer.onReady.forward);

		race(0, designerContext.state.onDefinitionChanged, designerContext.state.onSelectedStepIdChanged).subscribe(
			([definition, selectedStepId]) => {
				if (definition !== undefined) {
					designer.onDefinitionChanged.forward(designerContext.state.definition as TDef);
				}
				if (selectedStepId !== undefined) {
					designer.onSelectedStepIdChanged.forward(designerContext.state.selectedStepId);
				}
			}
		);

		designerContext.state.onViewportChanged.subscribe(designer.onViewportChanged.forward);
		designerContext.state.onIsToolboxCollapsedChanged.subscribe(designer.onIsToolboxCollapsedChanged.forward);
		designerContext.state.onIsEditorCollapsedChanged.subscribe(designer.onIsEditorCollapsedChanged.forward);
		return designer;
	}

	private constructor(
		private readonly view: DesignerView,
		private readonly state: DesignerState,
		private readonly stateModifier: StateModifier,
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
	 * @description Fires when the viewport has changed.
	 */
	public readonly onViewportChanged = new SimpleEvent<Viewport>();

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
		this.stateModifier.trySelectStepById(stepId);
	}

	/**
	 * @returns the current viewport.
	 */
	public getViewport(): Viewport {
		return this.state.viewport;
	}

	/**
	 * @description Sets the viewport.
	 * @param viewport Viewport.
	 */
	public setViewport(viewport: Viewport) {
		this.state.setViewport(viewport);
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
		return this.getHistoryController().dump();
	}

	/**
	 * Replaces the current definition with a new one and adds the previous definition to the undo stack.
	 * @param definition A new definition.
	 */
	public async replaceDefinition(definition: TDefinition) {
		this.getHistoryController().replaceDefinition(definition);

		await Promise.all([
			this.view.workspace.onRendered.first(), // This should be fired first
			this.onDefinitionChanged.first()
		]);
	}

	/**
	 * @param needle A step, a sequence or a step id.
	 * @returns parent steps and branch names.
	 */
	public getStepParents(needle: Sequence | Step | string): StepOrName[] {
		return this.walker.getParents(this.state.definition, needle);
	}

	/**
	 * @returns the definition walker.
	 */
	public getWalker(): DefinitionWalker {
		return this.walker;
	}

	/**
	 * @description Destroys the designer and deletes all nodes from the placeholder.
	 */
	public destroy() {
		this.view.destroy();
	}

	private getHistoryController(): HistoryController {
		if (!this.historyController) {
			throw new Error('Undo feature is not activated');
		}
		return this.historyController;
	}
}
