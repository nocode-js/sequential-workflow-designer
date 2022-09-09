import { DragStepBehavior } from '../behaviors/drag-step-behavior';
import { readMousePosition, readTouchPosition } from '../core/event-readers';
import { ObjectCloner } from '../core/object-cloner';
import { TypeValidator } from '../core/type-validator';
import { Uid } from '../core/uid';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { StepDefinition } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ToolboxItemView } from './toolbox-item-view';

export class ToolboxItem {
	public static create(parent: HTMLElement, step: StepDefinition, context: DesignerContext): ToolboxItem {
		TypeValidator.validate(step.type);

		const view = ToolboxItemView.create(parent, step, context.configuration.steps);
		const item = new ToolboxItem(step, context);
		view.bindMousedown(e => item.onMousedown(e));
		view.bindTouchstart(e => item.onTouchstart(e));
		view.bindContextMenu(e => item.onContextMenu(e));
		return item;
	}

	private constructor(private readonly step: StepDefinition, private readonly context: DesignerContext) {}

	private onTouchstart(e: TouchEvent) {
		e.preventDefault();
		if (e.touches.length === 1) {
			e.stopPropagation();
			this.startDrag(readTouchPosition(e));
		}
	}

	private onMousedown(e: MouseEvent) {
		e.stopPropagation();
		const isPrimaryButton = e.button === 0;
		if (isPrimaryButton) {
			this.startDrag(readMousePosition(e));
		}
	}

	private onContextMenu(e: MouseEvent) {
		e.preventDefault();
	}

	private startDrag(position: Vector) {
		if (!this.context.isReadonly) {
			const newStep = createStep(this.step);
			this.context.behaviorController.start(position, DragStepBehavior.create(this.context, newStep));
		}
	}
}

function createStep(step: StepDefinition): Step {
	const newStep = ObjectCloner.deepClone(step) as Step;
	newStep.id = Uid.next();
	return newStep;
}
