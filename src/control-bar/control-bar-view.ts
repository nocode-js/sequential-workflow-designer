import { Dom } from '../core/dom';

const CENTER_ICON =
	'<path d="M0 0h48v48h-48z" fill="none"/><path d="M24 16c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-14 14h-4v8c0 2.21 1.79 4 4 4h8v-4h-8v-8zm0-20h8v-4h-8c-2.21 0-4 1.79-4 4v8h4v-8zm28-4h-8v4h8v8h4v-8c0-2.21-1.79-4-4-4zm0 32h-8v4h8c2.21 0 4-1.79 4-4v-8h-4v8z"/>';
const DELETE_ICON =
	'<path d="M24 4c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm10 27.17l-2.83 2.83-7.17-7.17-7.17 7.17-2.83-2.83 7.17-7.17-7.17-7.17 2.83-2.83 7.17 7.17 7.17-7.17 2.83 2.83-7.17 7.17 7.17 7.17z" fill="#E01A24"/><path d="M0 0h48v48h-48z" fill="none"/>';
const MOVE_ICON =
	'<path d="M20 18h8v-6h6l-10-10-10 10h6v6zm-2 2h-6v-6l-10 10 10 10v-6h6v-8zm28 4l-10-10v6h-6v8h6v6l10-10zm-18 6h-8v6h-6l10 10 10-10h-6v-6z"/><path d="M0 0h48v48h-48z" fill="none"/>';

export class ControlBarView {
	public static create(parent: HTMLElement): ControlBarView {
		const root = Dom.element('div', {
			class: 'sqd-control-bar'
		});

		const deleteButton = createButton(DELETE_ICON, 'Delete selected step');
		deleteButton.classList.add('sqd-hidden');

		const resetButton = createButton(CENTER_ICON, 'Reset');

		const moveButton = createButton(MOVE_ICON, 'Turn on/off drag and drop');
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

	public bindDeleteButtonClick(handler: (e: Event) => void) {
		this.deleteButton.addEventListener('click', handler);
	}

	public bindMoveButtonClick(handler: (e: Event) => void) {
		this.moveButton.addEventListener('click', handler);
	}

	public bindResetButtonClick(handler: (e: Event) => void) {
		this.resetButton.addEventListener('click', handler);
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
	const icon = Dom.svg('svg', {
		class: 'sqd-control-bar-button-icon',
		viewBox: '0 0 48 48'
	});
	icon.innerHTML = iconContent;
	button.appendChild(icon);
	return button;
}
