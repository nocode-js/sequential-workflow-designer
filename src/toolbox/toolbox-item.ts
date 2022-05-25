import { DragStepBehavior } from '../behaviors/drag-step-behavior';
import { Dom } from '../core/dom';
import { Uid } from '../core/uid';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';

export class ToolboxItem {

	public static append(parent: HTMLElement, step: Step, context: DesignerContext): ToolboxItem {
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
		return item;
	}

	private constructor(
		private readonly step: Step,
		private readonly context: DesignerContext) {
	}

	private onMouseDown(e: MouseEvent) {
		const s = structuredClone(this.step);
		s.id = Uid.next();
		this.context.behaviorController.start(e, DragStepBehavior.create(this.context, s));
	}
}
