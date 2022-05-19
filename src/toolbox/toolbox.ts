import { ToolboxItem } from './toolbox-item';

export class Toolbox {

	public static append(parent: HTMLElement) {
		const toolbox = document.createElement('div');
		toolbox.className = 'sqd-toolbox';

		for (let i = 0; i < 12; i++) {
			ToolboxItem.append(toolbox);
		}

		parent.appendChild(toolbox);
	}
}
