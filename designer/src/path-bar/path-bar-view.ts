import { Dom } from '../core';
import { Icons } from '../core/icons';

const ITEMS_LIMIT = 3;

export class PathBarView {
	public static create(parent: HTMLElement): PathBarView {
		const root = Dom.element('div', {
			class: 'sqd-path-bar'
		});
		const resetButton = Dom.element('div', {
			class: 'sqd-path-bar-reset-button',
			title: 'Go to top'
		});
		const resetButtonIcon = Icons.createSvg('sqd-path-bar-reset-button-icon', Icons.folderUp);
		const items = Dom.element('div', {
			class: 'sqd-path-bar-items'
		});

		root.appendChild(resetButton);
		root.appendChild(items);
		resetButton.appendChild(resetButtonIcon);
		parent.appendChild(root);
		return new PathBarView(root, items, resetButton);
	}

	private onClickHandler?: (index: number) => void;

	private constructor(
		private readonly root: HTMLElement,
		private readonly items: HTMLElement,
		private readonly resetButton: HTMLElement
	) {}

	public bindOnItemClick(handler: (index: number) => void) {
		this.onClickHandler = handler;
	}

	public bindOnResetClick(handler: () => void) {
		this.resetButton.addEventListener('click', e => {
			e.preventDefault();
			handler();
		});
	}

	public reload(names: string[] | null) {
		const isHidden = names === null;
		Dom.toggleClass(this.root, isHidden, 'sqd-hidden');
		if (isHidden) {
			return;
		}

		this.items.innerHTML = '';

		const startIndex = Math.max(0, names.length - ITEMS_LIMIT);

		for (let index = startIndex; index < names.length; index++) {
			const name = names[index];
			if (index > 0) {
				const separator = Dom.element('span', {
					class: 'sqd-path-bar-separator'
				});
				separator.innerText = index === startIndex ? '...' : '/';
				this.items.appendChild(separator);
			}
			const item = Dom.element('span', {
				class: 'sqd-path-bar-item'
			});
			item.innerText = name;
			item.addEventListener('click', e => {
				e.preventDefault();
				if (this.onClickHandler) {
					this.onClickHandler(index);
				}
			});
			this.items.appendChild(item);
		}
	}
}
