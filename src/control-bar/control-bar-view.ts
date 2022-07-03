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
		const zoomInButton = createButton(Icons.zoomIn, 'Zoom in');
		const zoomOutButton = createButton(Icons.zoomOut, 'Zoom out');

		const moveButton = createButton(Icons.move, 'Turn on/off drag and drop');
		moveButton.classList.add('sqd-disabled');

		root.appendChild(resetButton);
		root.appendChild(zoomInButton);
		root.appendChild(zoomOutButton);
		root.appendChild(moveButton);
		root.appendChild(deleteButton);

		parent.appendChild(root);
		return new ControlBarView(resetButton, zoomInButton, zoomOutButton, moveButton, deleteButton);
	}

	private constructor(
		private readonly resetButton: HTMLElement,
		private readonly zoomInButton: HTMLElement,
		private readonly zoomOutButton: HTMLElement,
		private readonly moveButton: HTMLElement,
		private readonly deleteButton: HTMLElement
	) {}

	public bindResetButtonClick(handler: () => void) {
		bindClick(this.resetButton, handler);
	}

	public bindZoomInButtonClick(handler: () => void) {
		bindClick(this.zoomInButton, handler);
	}

	public bindZoomOutButtonClick(handler: () => void) {
		bindClick(this.zoomOutButton, handler);
	}

	public bindMoveButtonClick(handler: () => void) {
		bindClick(this.moveButton, handler);
	}

	public bindDeleteButtonClick(handler: () => void) {
		bindClick(this.deleteButton, handler);
	}

	public setIsDeleteButtonHidden(isHidden: boolean) {
		Dom.toggleClass(this.deleteButton, isHidden, 'sqd-hidden');
	}

	public setIsMoveButtonDisabled(isDisabled: boolean) {
		Dom.toggleClass(this.moveButton, isDisabled, 'sqd-disabled');
	}
}

function bindClick(element: HTMLElement, handler: () => void) {
	element.addEventListener('click', e => {
		e.preventDefault();
		handler();
	});
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
