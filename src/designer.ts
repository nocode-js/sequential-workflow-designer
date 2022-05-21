import { Sequence } from './definition';
import { BehaviorController } from './behaviors/behavior-controller';
import { Toolbox } from './toolbox/toolbox';
import { Workspace } from './workspace/workspace';

export class Designer {

	public static append(parent: HTMLElement, sequence: Sequence): Designer {
		const container = document.createElement('div');
		container.className = 'sqd-designer';

		parent.appendChild(container);

		const behaviorController = new BehaviorController();

		const workspace = Workspace.append(container, sequence, behaviorController);
		Toolbox.append(container, behaviorController, workspace);

		const designer = new Designer();
		return designer;
	}
}
