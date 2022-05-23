import { DragStepBehavior } from '../behaviors/drag-step-behavior';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';

export class ToolboxItem {

	public static append(parent: HTMLElement, step: Step, context: DesignerContext): ToolboxItem {
		const item = document.createElement('div');
		item.className = 'sqd-toolbox-item';

		const text = document.createElement('span');
		text.className = 'sqd-toolbox-item-text';
		text.textContent = step.name;

		item.appendChild(text);
		parent.appendChild(item);

		const ti = new ToolboxItem(
			step,
			context);
		item.addEventListener('mousedown', e => ti.onMouseDown(e));
		return ti;
	}

	private constructor(
		private readonly step: Step,
		private readonly context: DesignerContext) {
	}

	private onMouseDown(e: MouseEvent) {
		const s = structuredClone(this.step);
		this.context.behaviorController.start(e, DragStepBehavior.create(this.context, s));
	}
}
