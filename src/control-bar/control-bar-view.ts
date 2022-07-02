import { Dom } from '../core/dom';
import { Icons } from '../core/icons';

export class ControlBarView {
	public static create(parent: HTMLElement): ControlBarView {
		const root = Dom.element('div', {
			class: 'sqd-control-bar'
		});

		const deleteButton = createButton(Icons.delete, 'Delete selected step');
		deleteButton.classList.add('sqd-hidden');

		const resetButton = createButton(Icons.center, 'Reset');

		const moveButton = createButton(Icons.move, 'Turn on/off drag and drop');
		moveButton.classList.add('sqd-disabled');

		root.appendChild(resetButton);
		root.appendChild(moveButton);
		root.appendChild(deleteButton);

		parent.appendChild(root);
		return new ControlBarView(deleteButton, moveButton, resetButton);
	}

	private constructor(
		private readonly deleteButton: Element,
		private readonly moveButton: Element,
		private readonly resetButton: Element
	) {}

	public bindDeleteButtonClick(handler: () => void) {
		this.deleteButton.addEventListener('click', e => {
			e.preventDefault();
			handler();
		});
	}

	public bindMoveButtonClick(handler: () => void) {
		this.moveButton.addEventListener('click', e => {
			e.preventDefault();
			handler();
		});
	}

	public bindResetButtonClick(handler: () => void) {
		this.resetButton.addEventListener('click', e => {
			e.preventDefault();
			handler();
		});
	}

	public setIsDeleteButtonHidden(isHidden: boolean) {
		Dom.toggleClass(this.deleteButton, isHidden, 'sqd-hidden');
	}

	public setIsMoveButtonDisabled(isDisabled: boolean) {
		Dom.toggleClass(this.moveButton, isDisabled, 'sqd-disabled');
	}
}

function createButton(iconContent: string, title: string): HTMLElement {
	const button = Dom.element('div', {
		class: 'sqd-control-bar-button',
		title
	});
	const icon = Icons.create('sqd-control-bar-button-icon', iconContent);
	button.appendChild(icon);
	return button;
}
