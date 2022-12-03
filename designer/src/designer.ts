import { SimpleEvent } from './core/simple-event';
import { Definition } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { DesignerView } from './designer-view';
import { Utils } from './utils';
import { DesignerState } from './designer-state';
import { DefinitionModifier } from './definition-modifier';
import { WorkspaceController } from './workspace/workspace-controller';

export default class Designer {
	public static readonly utils = Utils;

	public static create(parent: HTMLElement, startDefinition: Definition, configuration: DesignerConfiguration): Designer {
		const context = DesignerContext.create(parent, startDefinition, configuration);

		const view = DesignerView.create(parent, context, context.layoutController, configuration);
		const designer = new Designer(view, context.state, context.definitionModifier, context.workspaceController);
		view.bindKeyUp(e => designer.onKeyUp(e));
		context.state.onDefinitionChanged.subscribe(() => designer.onDefinitionChanged.forward(context.state.definition));
		return designer;
	}

	private constructor(
		private readonly view: DesignerView,
		private readonly state: DesignerState,
		private readonly definitionModifier: DefinitionModifier,
		private readonly workspaceController: WorkspaceController
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
		return this.state.selectedStep?.id || null;
	}

	public selectStepById(stepId: string) {
		const component = this.workspaceController.getComponentByStepId(stepId);
		this.state.setSelectedStep(component.step);
	}

	public clearSelectedStep() {
		this.state.setSelectedStep(null);
	}

	public moveViewPortToStep(stepId: string) {
		const component = this.workspaceController.getComponentByStepId(stepId);
		this.workspaceController.moveViewPortToStep(component);
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
		if (!this.state.selectedStep || this.state.isReadonly || this.state.isDragging) {
			return;
		}

		e.preventDefault();
		e.stopPropagation();
		this.definitionModifier.tryDelete(this.state.selectedStep);
	}
}
