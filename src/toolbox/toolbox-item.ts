import { DragStepBehavior } from '../behaviors/drag-step-behavior';
import { readMousePosition, readTouchPosition } from '../core/event-readers';
import { ObjectCloner } from '../core/object-cloner';
import { Uid } from '../core/uid';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';
import { ToolboxItemView } from './toolbox-item-view';

export class ToolboxItem {
	public static create(parent: HTMLElement, step: Step, context: DesignerContext): ToolboxItem {
		const view = ToolboxItemView.create(parent, step, context.configuration.steps);
		const item = new ToolboxItem(step, context);
		view.bindMousedown(e => item.onMousedown(e));
		view.bindTouchstart(e => item.onTouchstart(e));
		return item;
	}

	private constructor(private readonly step: Step, private readonly context: DesignerContext) {}

	private onTouchstart(e: TouchEvent) {
		e.preventDefault();
		e.stopPropagation();
		this.startDrag(readTouchPosition(e));
	}

	private onMousedown(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();
		this.startDrag(readMousePosition(e));
	}

	private startDrag(position: Vector) {
		if (!this.context.isReadonly) {
			const newStep = ObjectCloner.deepClone(this.step);
			newStep.id = Uid.next();
			this.context.behaviorController.start(position, DragStepBehavior.create(this.context, newStep));
		}
	}
}
