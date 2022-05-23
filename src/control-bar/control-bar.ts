import { Svg } from '../core/svg';
import { Step } from '../definition';
import { Workspace } from '../workspace/workspace';

const CENTER_ICON = '<path d="M0 0h48v48h-48z" fill="none"/><path d="M24 16c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-14 14h-4v8c0 2.21 1.79 4 4 4h8v-4h-8v-8zm0-20h8v-4h-8c-2.21 0-4 1.79-4 4v8h4v-8zm28-4h-8v4h8v8h4v-8c0-2.21-1.79-4-4-4zm0 32h-8v4h8c2.21 0 4-1.79 4-4v-8h-4v8z"/>';
const DELETE_ICON = '<path d="M24 4c-11.05 0-20 8.95-20 20s8.95 20 20 20 20-8.95 20-20-8.95-20-20-20zm10 27.17l-2.83 2.83-7.17-7.17-7.17 7.17-2.83-2.83 7.17-7.17-7.17-7.17 2.83-2.83 7.17 7.17 7.17-7.17 2.83 2.83-7.17 7.17 7.17 7.17z"/><path d="M0 0h48v48h-48z" fill="none"/>';
const MOVE_ICON = '<path d="M20 18h8v-6h6l-10-10-10 10h6v6zm-2 2h-6v-6l-10 10 10 10v-6h6v-8zm28 4l-10-10v6h-6v8h6v6l10-10zm-18 6h-8v6h-6l10 10 10-10h-6v-6z"/><path d="M0 0h48v48h-48z" fill="none"/>';

export class ControlBar {

	public static append(parent: HTMLElement, workspace: Workspace): ControlBar {
		const root = document.createElement('div');
		root.className = 'sqd-control-bar';

		const deleteButton = createButton(DELETE_ICON, 'Delete selected step');
		deleteButton.classList.add('sqd-hidden');

		const centerButton = createButton(CENTER_ICON, 'Center');

		const moveButton = createButton(MOVE_ICON, 'Turn on/off drag and drop');
		moveButton.classList.add('sqd-disabled');

		root.appendChild(deleteButton);
		root.appendChild(centerButton);
		root.appendChild(moveButton);

		parent.appendChild(root);
		const cb = new ControlBar(deleteButton, moveButton, workspace);
		workspace.onSelectedStepChanged.subscribe(s => cb.onSelectedStepChanged(s));
		workspace.onIsReadonlyChanged.subscribe(i => cb.onIsReadonlyChanged(i));
		deleteButton.addEventListener('click', e => cb.onDeleteButtonClicked(e));
		centerButton.addEventListener('click', e => cb.onCenterButtonClicked(e));
		moveButton.addEventListener('click', e => cb.onMoveButtonClicked(e));
		return cb;
	}

	private constructor(
		private readonly deleteButton: HTMLElement,
		private readonly moveButton: HTMLElement,
		private readonly workspace: Workspace) {
	}

	private onSelectedStepChanged(step: Step | null) {
		if (step) {
			this.deleteButton.classList.remove('sqd-hidden');
		} else {
			this.deleteButton.classList.add('sqd-hidden');
		}
	}

	private onIsReadonlyChanged(isReadonly: boolean) {
		if (isReadonly) {
			this.moveButton.classList.remove('sqd-disabled');
		} else {
			this.moveButton.classList.add('sqd-disabled');
		}
	}

	private onDeleteButtonClicked(e: MouseEvent) {
		e.preventDefault();
		this.workspace.removeSelectedStep();
	}

	private onCenterButtonClicked(e: MouseEvent) {
		e.preventDefault();
		this.workspace.center();
	}

	public onMoveButtonClicked(e: MouseEvent) {
		e.preventDefault();
		this.workspace.toggleIsReadonly();
	}
}

function createButton(iconContent: string, title: string): HTMLElement {
	const button = document.createElement('div');
	button.className = 'sqd-control-bar-button';
	button.setAttribute('title', title);
	const icon = Svg.element('svg', {
		viewBox: '0 0 48 48'
	});
	icon.innerHTML = iconContent;
	button.appendChild(icon);
	return button;
}
