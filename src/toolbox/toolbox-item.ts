import { DragStepBehavior } from '../behaviors/drag-step-behavior';
import { Step } from '../definition';
import { DesignerContext } from '../designer-context';

export class ToolboxItem {

	public static append(parent: HTMLElement, step: Step, context: DesignerContext): ToolboxItem {
		const root = document.createElement('div');
		root.className = 'sqd-toolbox-item';

		const iconUrl = context.configuration.stepIconUrlProvider
			? context.configuration.stepIconUrlProvider(step.type, step.internalType)
			: null;

		const icon = document.createElement('span');
		icon.className = 'sqd-toolbox-item-icon';

		if (iconUrl) {
			const iconImage = document.createElement('img');
			iconImage.setAttribute('src', iconUrl);
			iconImage.className = 'sqd-toolbox-item-icon-image';
			icon.appendChild(iconImage);
		} else {
			icon.classList.add('sqd-no-icon');
		}

		const text = document.createElement('span');
		text.className = 'sqd-toolbox-item-text';
		text.textContent = step.internalType;

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
		this.context.behaviorController.start(e, DragStepBehavior.create(this.context, s));
	}
}
