import { StepType, SwitchStep, TaskStep } from '../definition';
import { DesignerContext } from '../designer-context';
import { ToolboxItem } from './toolbox-item';

export class Toolbox {

	public static append(parent: HTMLElement, context: DesignerContext): Toolbox {
		const toolbox = document.createElement('div');
		toolbox.className = 'sqd-toolbox';

		const title = document.createElement('span');
		title.className = 'sqd-toolbox-title';
		title.innerText = 'Steps';
		toolbox.appendChild(title);

		const taskStep = {
			type: StepType.task,
			name: 'x'
		} as TaskStep;
		ToolboxItem.append(toolbox, taskStep, context);

		const ifStep = {
			type: StepType.switch,
			name: 'if',
			branches: {
				'true': { steps: [] },
				'false': { steps: [] }
			}
		} as SwitchStep;
		ToolboxItem.append(toolbox, ifStep, context);

		parent.appendChild(toolbox);
		return new Toolbox();
	}
}
