import { DesignerContext } from '../designer-context';
import { ToolboxItem } from './toolbox-item';

export class Toolbox {

	public static append(parent: HTMLElement, context: DesignerContext): Toolbox {
		const root = document.createElement('div');
		root.className = 'sqd-toolbox';

		const title = document.createElement('span');
		title.className = 'sqd-toolbox-title';
		title.innerText = 'Steps';
		root.appendChild(title);

		context.configuration.toolboxSteps.forEach(step => {
			ToolboxItem.append(root, step, context);
		});

		parent.appendChild(root);
		return new Toolbox();
	}
}
