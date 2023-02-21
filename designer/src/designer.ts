import { SimpleEvent } from './core/simple-event';
import { isElementAttached } from './core/is-element-attached';
import { Definition, Sequence, Step } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { DesignerView } from './designer-view';
import { DesignerState } from './designer-state';
import { DefinitionModifier } from './definition-modifier';
import { WorkspaceController } from './workspace/workspace-controller';
import { StepOrName, StepsTraverser } from './core/steps-traverser';
import { ServicesResolver } from './services';

export class Designer {
	/**
	 * Creates a designer.
	 * @param placeholder Placeholder where the designer will be attached.
	 * @param startDefinition Start definition of a flow.
	 * @param configuration Designer's configuration.
	 * @returns An instance of the designer.
	 */
	public static create(placeholder: HTMLElement, startDefinition: Definition, configuration: DesignerConfiguration): Designer {
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

		const services = ServicesResolver.resolve(configuration.extensions);
		const designerContext = DesignerContext.create(placeholder, startDefinition, configuration, services);

		const view = DesignerView.create(placeholder, designerContext, configuration);
		const designer = new Designer(
			view,
			designerContext.state,
			designerContext.definitionModifier,
			designerContext.workspaceController,
			designerContext.stepsTraverser
		);
		view.bindKeyUp(e => designer.onKeyUp(e));
		view.workspace.onReady.subscribe(() => designer.onReady.forward());

		designerContext.state.onDefinitionChanged.subscribe(() => {
			setTimeout(() => designer.onDefinitionChanged.forward(designerContext.state.definition));
		});
		designerContext.state.onSelectedStepIdChanged.subscribe(() =>
			designer.onSelectedStepIdChanged.forward(designerContext.state.selectedStepId)
		);
		return designer;
	}

	private constructor(
		private readonly view: DesignerView,
		private readonly state: DesignerState,
		private readonly definitionModifier: DefinitionModifier,
		private readonly workspaceController: WorkspaceController,
		private readonly stepsTraverser: StepsTraverser
	) {}

	/**
	 * @description Fires when the designer is initialized and ready to use.
	 */
	public readonly onReady = new SimpleEvent<void>();

	/**
	 * @description Fires when the definition has changed.
	 */
	public readonly onDefinitionChanged = new SimpleEvent<Definition>();

	/**
	 * @description Fires when the selected step has changed.
	 */
	public readonly onSelectedStepIdChanged = new SimpleEvent<string | null>();

	/**
	 * @returns the current definition of the workflow.
	 */
	public getDefinition(): Definition {
		return this.state.definition;
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
	 * @description Moves the view port to the step with the animation.
	 */
	public moveViewPortToStep(stepId: string) {
		const component = this.workspaceController.getComponentByStepId(stepId);
		this.workspaceController.moveViewPortToStep(component);
	}

	/**
	 * @returns parent steps and branch names of the passed step or the passed sequence.
	 */
	public getStepParents(needle: Sequence | Step): StepOrName[] {
		return this.stepsTraverser.getParents(this.state.definition, needle);
	}

	/**
	 * @description Destroys the designer and deletes all nodes from the placeholder.
	 */
	public destroy() {
		this.view.destroy();
	}

	private onKeyUp(e: KeyboardEvent) {
		const supportedKeys = ['Backspace', 'Delete'];
		if (!supportedKeys.includes(e.key)) {
			return;
		}
		const ignoreTagNames = ['INPUT', 'TEXTAREA'];
		if (document.activeElement && ignoreTagNames.includes(document.activeElement.tagName)) {
			return;
		}
		if (!this.state.selectedStepId || this.state.isReadonly || this.state.isDragging) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();

		const isDeletable = this.definitionModifier.isDeletable(this.state.selectedStepId);
		if (isDeletable) {
			this.definitionModifier.tryDelete(this.state.selectedStepId);
		}
	}
}
