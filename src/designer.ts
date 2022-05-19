import { Sequence } from './definition';
import { Toolbox } from './toolbox/toolbox';
import { Workspace } from './workspace/workspace';

export class Designer {

	public static append(parent: HTMLElement, sequence: Sequence) {
		const container = document.createElement('div');
		container.className = 'sqd-designer';

		parent.appendChild(container);

		Workspace.append(container, sequence);
		Toolbox.append(container);
	}
}
