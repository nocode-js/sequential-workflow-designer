import { Vector } from '../../core';
import { ContextMenuItem } from '../../designer-extension';

export class ContextMenu {
	public static create(shadowRoot: ShadowRoot | undefined, position: Vector, theme: string, items: ContextMenuItem[]) {
		const menu = document.createElement('div');
		menu.style.left = `${position.x}px`;
		menu.style.top = `${position.y}px`;
		menu.className = `sqd-context-menu sqd-theme-${theme}`;

		const elements: HTMLElement[] = [];
		for (let index = 0; index < items.length; index++) {
			const item = items[index];
			const element = document.createElement('div');

			if (item.callback) {
				element.className = 'sqd-context-menu-item';
				element.innerText = item.label;
			} else {
				element.className = 'sqd-context-menu-group';
				element.innerText = item.label;
			}

			elements.push(element);
			menu.appendChild(element);
		}

		const body = shadowRoot ?? document.body;
		const dom = shadowRoot ?? document;
		const instance = new ContextMenu(body, dom, menu, elements, items, Date.now());
		dom.addEventListener('mousedown', instance.mouseDown, false);
		dom.addEventListener('mouseup', instance.mouseUp, false);
		dom.addEventListener('touchstart', instance.mouseDown, false);
		dom.addEventListener('touchend', instance.mouseUp, false);
		body.appendChild(menu);
		return instance;
	}

	private isAttached = true;

	private constructor(
		private readonly body: Node,
		private readonly dom: Document | ShadowRoot,
		private readonly menu: HTMLElement,
		private readonly elements: HTMLElement[],
		private readonly items: ContextMenuItem[],
		private readonly startTime: number
	) {}

	private readonly mouseDown = (e: Event) => {
		const index = this.findIndex(e.target as HTMLElement);
		if (index === null) {
			this.tryDestroy();
		} else {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	private readonly mouseUp = (e: Event) => {
		const dt = Date.now() - this.startTime;
		if (dt < 300) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}

		try {
			const index = this.findIndex(e.target as HTMLElement);
			if (index !== null) {
				const item = this.items[index];
				if (item.callback) {
					item.callback();
				}
			}
		} finally {
			this.tryDestroy();
		}
	};

	private findIndex(element: HTMLElement): number | null {
		for (let index = 0; index < this.elements.length; index++) {
			if (this.elements[index].contains(element)) {
				return index;
			}
		}
		return null;
	}

	public tryDestroy() {
		if (this.isAttached) {
			this.body.removeChild(this.menu);
			this.dom.removeEventListener('mousedown', this.mouseDown, false);
			this.dom.removeEventListener('mouseup', this.mouseUp, false);
			this.dom.removeEventListener('touchstart', this.mouseDown, false);
			this.dom.removeEventListener('touchend', this.mouseUp, false);
			this.isAttached = false;
		}
	}
}
