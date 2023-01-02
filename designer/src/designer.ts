import { SimpleEvent } from './core/simple-event';
import { Definition, Sequence, Step } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { DesignerView } from './designer-view';
import { DesignerState } from './designer-state';
import { DefinitionModifier } from './definition-modifier';
import { WorkspaceController } from './workspace/workspace-controller';
import { ComponentContext } from './workspace/component-context';
import { StepExtensionsResolver } from './workspace/step-extensions-resolver';
import { StepOrName, StepsTraverser } from './core/steps-traverser';

export class Designer {
	/**
	 * Creates a designer.
	 * @param placeholder Placeholder where a designer will be attached.
	 * @param startDefinition Start definition of a flow.
	 * @param configuration Designer's configuration.
	 * @returns An instance of a designer.
	 */
	public static create(placeholder: HTMLElement, startDefinition: Definition, configuration: DesignerConfiguration): Designer {
		const stepExtensions = StepExtensionsResolver.resolve(configuration.extensions);

		const designerContext = DesignerContext.create(placeholder, startDefinition, configuration, stepExtensions);
		const componentContext = ComponentContext.create(configuration.steps, stepExtensions);

		const view = DesignerView.create(placeholder, designerContext, componentContext, designerContext.layoutController, configuration);
		const designer = new Designer(
			view,
			designerContext.state,
			designerContext.definitionModifier,
			designerContext.workspaceController,
			designerContext.stepsTraverser
		);
		view.bindKeyUp(e => designer.onKeyUp(e));
		designerContext.state.onDefinitionChanged.subscribe(() => designer.onDefinitionChanged.forward(designerContext.state.definition));
		return designer;
	}

	private constructor(
		private readonly view: DesignerView,
		private readonly state: DesignerState,
		private readonly definitionModifier: DefinitionModifier,
		private readonly workspaceController: WorkspaceController,
		private readonly stepsTraverser: StepsTraverser
	) {}

	public readonly onDefinitionChanged = new SimpleEvent<Definition>();

	public getDefinition(): Definition {
		return this.state.definition;
	}

	public isValid(): boolean {
		return this.view.workspace.isValid;
	}

	public isReadonly(): boolean {
		return this.state.isReadonly;
	}

	public setIsReadonly(isReadonly: boolean) {
		this.state.setIsReadonly(isReadonly);
	}

	public getSelectedStepId(): string | null {
		return this.state.selectedStepId;
	}

	public selectStepById(stepId: string) {
		this.state.setSelectedStepId(stepId);
	}

	public clearSelectedStep() {
		this.state.setSelectedStepId(null);
	}

	public moveViewPortToStep(stepId: string) {
		const component = this.workspaceController.getComponentByStepId(stepId);
		this.workspaceController.moveViewPortToStep(component);
	}

	public getStepParents(needle: Sequence | Step): StepOrName[] {
		return this.stepsTraverser.getParents(this.state.definition, needle);
	}

	public destroy() {
		this.view.destroy();
	}

	private onKeyUp(e: KeyboardEvent) {
		const supportedKeys = ['Backspace', 'Delete'];
		if (!supportedKeys.includes(e.key)) {
			return;
		}
		const ignoreTagNames = ['input', 'textarea'];
		if (document.activeElement && ignoreTagNames.includes(document.activeElement.tagName.toLowerCase())) {
			return;
		}
		if (!this.state.selectedStepId || this.state.isReadonly || this.state.isDragging) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
		this.definitionModifier.tryDelete(this.state.selectedStepId);
	}
}
