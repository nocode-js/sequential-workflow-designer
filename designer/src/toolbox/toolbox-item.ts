import { ToolboxApi } from '../api/toolbox-api';
import { readMousePosition, readTouchPosition } from '../core/event-readers';
import { StepTypeValidator } from '../core/step-type-validator';
import { Vector } from '../core/vector';
import { StepDefinition } from '../designer-configuration';
import { ToolboxItemView } from './toolbox-item-view';

export class ToolboxItem {
	public static create(parent: HTMLElement, step: StepDefinition, api: ToolboxApi): ToolboxItem {
		StepTypeValidator.validate(step.type);

		const view = ToolboxItemView.create(parent, step, api);
		const item = new ToolboxItem(step, api);
		view.bindMousedown(e => item.onMousedown(e));
		view.bindTouchstart(e => item.onTouchstart(e));
		view.bindContextMenu(e => item.onContextMenu(e));
		return item;
	}

	private constructor(private readonly step: StepDefinition, private readonly api: ToolboxApi) {}

	private onTouchstart(e: TouchEvent) {
		e.preventDefault();
		if (e.touches.length === 1) {
			e.stopPropagation();
			this.tryDrag(readTouchPosition(e));
		}
	}

	private onMousedown(e: MouseEvent) {
		e.stopPropagation();
		const isPrimaryButton = e.button === 0;
		if (isPrimaryButton) {
			this.tryDrag(readMousePosition(e));
		}
	}

	private onContextMenu(e: MouseEvent) {
		e.preventDefault();
	}

	private tryDrag(position: Vector) {
		this.api.tryDrag(position, this.step);
	}
}
