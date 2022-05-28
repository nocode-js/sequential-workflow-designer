import { DragStepBehavior } from '../behaviors/drag-step-behavior';
import { Dom } from '../core/dom';
import { readMousePosition, readTouchPosition } from '../core/event-readers';
import { ObjectCloner } from '../core/object-cloner';
import { Uid } from '../core/uid';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';

export class ToolboxItem {

	public static create(parent: HTMLElement, step: Step, context: DesignerContext): ToolboxItem {
		const root = Dom.element('div', {
			class: 'sqd-toolbox-item'
		});

		const iconUrl = context.configuration.steps.iconUrlProvider
			? context.configuration.steps.iconUrlProvider(step.componentType, step.type)
			: null;

		const icon = Dom.element('div', {
			class: 'sqd-toolbox-item-icon'
		});

		if (iconUrl) {
			const iconImage = Dom.element('img', {
				class: 'sqd-toolbox-item-icon-image',
				src: iconUrl
			});
			icon.appendChild(iconImage);
		} else {
			icon.classList.add('sqd-no-icon');
		}

		const text = Dom.element('div', {
			class: 'sqd-toolbox-item-text'
		});
		text.textContent = step.name;

		root.appendChild(icon);
		root.appendChild(text);
		parent.appendChild(root);

		const item = new ToolboxItem(
			step,
			context);
		root.addEventListener('mousedown', e => item.onMouseDown(e));
		root.addEventListener('touchstart', e => item.onTouchStart(e));
		return item;
	}

	private constructor(
		private readonly step: Step,
		private readonly context: DesignerContext) {
	}

	private onTouchStart(e: TouchEvent) {
		e.preventDefault();
		this.startDrag(readTouchPosition(e));

	}

	private onMouseDown(e: MouseEvent) {
		e.preventDefault();
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
