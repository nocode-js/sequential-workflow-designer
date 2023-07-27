import { Vector } from '../../core';

export class ContextMenu {
	public static create(position: Vector, theme: string, items: ContextMenuItems) {
		const menu = document.createElement('div');
		menu.style.left = `${position.x}px`;
		menu.style.top = `${position.y}px`;
		menu.className = `sqd-context-menu sqd-theme-${theme}`;

		const elements: HTMLElement[] = [];
		for (let index = 0; index < items.length; index++) {
			const item = items[index];
			const element = document.createElement('div');

			if (typeof item === 'string') {
				element.className = 'sqd-context-menu-group';
				element.innerText = item;
			} else {
				element.className = 'sqd-context-menu-item';
				element.innerText = item.label;
			}

			elements.push(element);
			menu.appendChild(element);
		}

		const instance = new ContextMenu(menu, elements, items, Date.now());
		document.addEventListener('mousedown', instance.mouseDown, false);
		document.addEventListener('mouseup', instance.mouseUp, false);
		document.addEventListener('touchstart', instance.mouseDown, false);
		document.addEventListener('touchend', instance.mouseUp, false);
		document.body.appendChild(menu);
		return instance;
	}

	private isAttached = true;

	private constructor(
		private readonly menu: HTMLElement,
		private readonly elements: HTMLElement[],
		private readonly items: ContextMenuItems,
		private readonly startTime: number
	) {}

	private readonly mouseDown = (e: MouseEvent | TouchEvent) => {
		const index = this.findIndex(e.target as HTMLElement);
		if (index === null) {
			this.tryDestroy();
		} else {
			e.preventDefault();
			e.stopPropagation();
		}
	};

	private readonly mouseUp = (e: MouseEvent | TouchEvent) => {
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
				if (typeof item !== 'string') {
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
			document.body.removeChild(this.menu);
			document.removeEventListener('mousedown', this.mouseDown, false);
			document.removeEventListener('mouseup', this.mouseUp, false);
			document.removeEventListener('touchstart', this.mouseDown, false);
			document.removeEventListener('touchend', this.mouseUp, false);
			this.isAttached = false;
		}
	}
}

export type ContextMenuItems = (string | ContextMenuItem)[];

export interface ContextMenuItem {
	label: string;
	callback: () => void;
}
