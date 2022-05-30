import { BehaviorController } from './behaviors/behavior-controller';
import { ControlBar } from './control-bar/control-bar';
import { Dom } from './core/dom';
import { ObjectCloner } from './core/object-cloner';
import { SimpleEvent } from './core/simple-event';
import { Definition } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { SmartEditor } from './smart-editor/smart-editor';
import { Toolbox } from './toolbox/toolbox';
import { Workspace } from './workspace/workspace';

export class Designer {

	public static create(container: HTMLElement, startDefinition: Definition, configuration: DesignerConfiguration): Designer {
		const theme = configuration.theme || 'light';
		const definition = ObjectCloner.deepClone(startDefinition);

		const root = Dom.element('div', {
			class: `sqd-designer sqd-theme-${theme}`
		});

		container.appendChild(root);

		const behaviorController = new BehaviorController();
		const context = new DesignerContext(definition, behaviorController, configuration);

		const workspace = Workspace.create(root, context);
		if (!configuration.toolbox.isHidden) {
			Toolbox.create(root, context);
		}
		ControlBar.create(root, context);
		if (!configuration.editors.isHidden) {
			SmartEditor.create(root, context);
		}

		const designer = new Designer(context, workspace);
		context.onDefinitionChanged.subscribe(() => designer.onDefinitionChanged.forward(context.definition));
		return designer;
	}

	private constructor(
		private readonly context: DesignerContext,
		private readonly workspace: Workspace) {
	}

	public readonly onDefinitionChanged = new SimpleEvent<Definition>();

	public getDefinition(): Definition {
		return this.context.definition;
	}

	public revalidate() {
		this.workspace.revalidate();
	}

	public isValid(): boolean {
		return this.workspace.isValid;
	}

	public isReadonly(): boolean {
		return this.context.isReadonly;
	}

	public notifiyDefinitionChanged() {
		this.context.notifiyDefinitionChanged();
	}

	public setIsReadonly(isReadonly: boolean) {
		this.context.setIsReadonly(isReadonly);
	}

	public getSelectedStepId(): string | null {
		return this.context.selectedStep?.id || null;
	}

	public selectStepById(stepId: string) {
		this.context.selectStepById(stepId);
	}

	public clearSelectedStep() {
		this.context.setSelectedStep(null);
	}

	public moveViewPortToStep(stepId: string) {
		this.context.moveViewPortToStep(stepId);
	}
}
