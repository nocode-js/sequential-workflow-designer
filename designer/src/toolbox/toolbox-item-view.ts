import { ToolboxItemData } from './toolbox-data-provider';
import { Dom } from '../core/dom';

export class ToolboxItemView {
	public static create(parent: HTMLElement, data: ToolboxItemData): ToolboxItemView {
		const root = Dom.element('div', {
			class: `sqd-toolbox-item sqd-type-${data.step.type}`,
			title: data.description
		});

		const icon = Dom.element('div', {
			class: 'sqd-toolbox-item-icon'
		});

		if (data.iconUrl) {
			const iconImage = Dom.element('img', {
				class: 'sqd-toolbox-item-icon-image',
				src: data.iconUrl
			});
			icon.appendChild(iconImage);
		} else {
			icon.classList.add('sqd-no-icon');
		}

		const text = Dom.element('div', {
			class: 'sqd-toolbox-item-text'
		});
		text.textContent = data.label;

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
