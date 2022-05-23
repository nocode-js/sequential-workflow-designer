import { BehaviorController } from './behaviors/behavior-controller';
import { ControlBar } from './control-bar/control-bar';
import { Sequence } from './definition';
import { SmartEditor } from './smart-editor/smart-editor';
import { Toolbox } from './toolbox/toolbox';
import { Workspace } from './workspace/workspace';

export class Designer {

	public static append(parent: HTMLElement, sequence: Sequence): Designer {
		const root = document.createElement('div');
		root.className = 'sqd-designer';

		parent.appendChild(root);

		const behaviorController = new BehaviorController();

		const workspace = Workspace.append(root, sequence, behaviorController);
		Toolbox.append(root, behaviorController, workspace);
		ControlBar.append(root, workspace);
		SmartEditor.append(root, workspace);


		const designer = new Designer();
		return designer;
	}
}
