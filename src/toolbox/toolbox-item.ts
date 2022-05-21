import { BehaviorController } from '../behaviors/behavior-controller';
import { DragStepBehavior } from '../behaviors/drag-step-behavior';
import { Step } from '../definition';
import { Workspace } from '../workspace/workspace';

export class ToolboxItem {

	public static append(parent: HTMLElement, step: Step, behaviorController: BehaviorController, workspace: Workspace): ToolboxItem {
		const item = document.createElement('div');
		item.className = 'sqd-toolbox-item';

		const text = document.createElement('span');
		text.className = 'sqd-toolbox-item-text';
		text.textContent = step.name;

		item.appendChild(text);
		parent.appendChild(item);

		const ti = new ToolboxItem(
			step,
			behaviorController,
			workspace);
		item.addEventListener('mousedown', e => ti.onMouseDown(e));
		return ti;
	}

	private constructor(
		private readonly step: Step,
		private readonly behaviorController: BehaviorController,
		private readonly workspace: Workspace) {
	}

	private onMouseDown(e: MouseEvent) {
		const s = structuredClone(this.step);
		this.behaviorController.start(e, DragStepBehavior.create(this.workspace, s));
	}
}
