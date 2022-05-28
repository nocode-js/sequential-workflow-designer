import { BehaviorController } from './behaviors/behavior-controller';
import { ControlBar } from './control-bar/control-bar';
import { Dom } from './core/dom';
import { SimpleEvent } from './core/simple-event';
import { Definition } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { SmartEditor } from './smart-editor/smart-editor';
import { Toolbox } from './toolbox/toolbox';
import { Workspace } from './workspace/workspace';

export class Designer {

	public static create(container: HTMLElement, definition: Definition, configuration: DesignerConfiguration): Designer {
		const theme = configuration.theme || 'light';
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

	public getDefiniton(): Definition {
		return this.context.definition;
	}

	public revalidate() {
		this.workspace.revalidate();
	}

	public isValid(): boolean {
		return this.workspace.isValid;
	}
}
