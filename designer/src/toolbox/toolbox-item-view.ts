import { ToolboxApi } from '../api/toolbox-api';
import { Dom } from '../core/dom';
import { StepDefinition } from '../designer-configuration';

export class ToolboxItemView {
	public static create(parent: HTMLElement, step: StepDefinition, api: ToolboxApi): ToolboxItemView {
		const label = api.getLabel(step);
		const root = Dom.element('div', {
			class: `sqd-toolbox-item sqd-type-${step.type}`,
			title: label
		});

		const iconUrl = api.tryGetIconUrl(step);

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
		text.textContent = label;

		root.appendChild(icon);
		root.appendChild(text);
		parent.appendChild(root);
		return new ToolboxItemView(root);
	}

	private constructor(private readonly root: HTMLElement) {}

	public bindMousedown(handler: (e: MouseEvent) => void) {
		this.root.addEventListener('mousedown', handler, false);
	}

	public bindTouchstart(handler: (e: TouchEvent) => void) {
		this.root.addEventListener('touchstart', handler, false);
	}

	public bindContextMenu(handler: (e: MouseEvent) => void) {
		this.root.addEventListener('contextmenu', handler, false);
	}
}
