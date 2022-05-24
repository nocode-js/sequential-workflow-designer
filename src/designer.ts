import { BehaviorController } from './behaviors/behavior-controller';
import { ControlBar } from './control-bar/control-bar';
import { Definition } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';
import { SmartEditor } from './smart-editor/smart-editor';
import { Toolbox } from './toolbox/toolbox';
import { Workspace } from './workspace/workspace';

export class Designer {

	public static create(container: HTMLElement, definition: Definition, configuration: DesignerConfiguration): Designer {
		const root = document.createElement('div');
		root.className = 'sqd-designer';

		container.appendChild(root);

		const behaviorController = new BehaviorController();
		const context = new DesignerContext(definition, behaviorController, configuration);

		Workspace.append(root, context);
		Toolbox.append(root, context);
		ControlBar.append(root, context);
		SmartEditor.append(root, context);

		const designer = new Designer();
		return designer;
	}
}
