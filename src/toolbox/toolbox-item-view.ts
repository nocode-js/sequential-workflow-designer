import { Dom } from '../core/dom';
import { readMousePosition } from '../core/event-readers';
import { Vector } from '../core/vector';
import { StepDefinition, StepsConfiguration } from '../designer-configuration';

export class ToolboxItemView {
	public static create(parent: HTMLElement, step: StepDefinition, configuration: StepsConfiguration): ToolboxItemView {
		const root = Dom.element('div', {
			class: 'sqd-toolbox-item',
			title: step.name
		});

		const iconUrl = configuration.iconUrlProvider ? configuration.iconUrlProvider(step.componentType, step.type) : null;

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
		return new ToolboxItemView(root);
	}

	private constructor(private readonly root: HTMLElement) {}

	public bindMousedown(handler: (position: Vector) => void) {
		this.root.addEventListener(
			'mousedown',
			e => {
				e.stopPropagation();
				handler(readMousePosition(e));
			},
			false
		);
	}

	public bindTouchstart(handler: (e: TouchEvent) => void) {
		this.root.addEventListener('touchstart', handler, false);
	}
}
