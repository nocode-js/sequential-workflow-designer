import { StepType, SwitchStep, TaskStep } from '../definition';
import { BehaviorController } from '../behaviors/behavior-controller';
import { Workspace } from '../workspace/workspace';
import { ToolboxItem } from './toolbox-item';

export class Toolbox {

	public static append(parent: HTMLElement, behaviorController: BehaviorController, workspace: Workspace): Toolbox {
		const toolbox = document.createElement('div');
		toolbox.className = 'sqd-toolbox';

		const taskStep = {
			type: StepType.task,
			name: 'x'
		} as TaskStep;
		ToolboxItem.append(toolbox, taskStep, behaviorController, workspace);

		const ifStep = {
			type: StepType.switch,
			name: 'if',
			branches: {
				'true': { steps: [] },
				'false': { steps: [] }
			}
		} as SwitchStep;
		ToolboxItem.append(toolbox, ifStep, behaviorController, workspace);

		parent.appendChild(toolbox);
		return new Toolbox();
	}
}
