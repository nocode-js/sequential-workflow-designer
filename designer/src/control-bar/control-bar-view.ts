import { Dom } from '../core/dom';
import { Icons } from '../core/icons';
import { I18n } from '../designer-configuration';
import { ControlBarAddon, ControlBarAddonFactory } from './control-bar';
import { ControlBarButtonView } from './control-bar-button-view';

export class ControlBarView {
	public static create(
		parent: HTMLElement,
		isUndoRedoSupported: boolean,
		isDisableDragDisabled: boolean,
		i18n: I18n,
		addonFactory: ControlBarAddonFactory | null
	): ControlBarView {
		const root = Dom.element('div', {
			class: 'sqd-control-bar'
		});

		const resetButton = ControlBarButtonView.create(root, Icons.center, i18n('controlBar.resetView', 'Reset view'));
		const zoomInButton = ControlBarButtonView.create(root, Icons.zoomIn, i18n('controlBar.zoomIn', 'Zoom in'));
		const zoomOutButton = ControlBarButtonView.create(root, Icons.zoomOut, i18n('controlBar.zoomOut', 'Zoom out'));

		let undoButton: ControlBarButtonView | null = null;
		let redoButton: ControlBarButtonView | null = null;
		if (isUndoRedoSupported) {
			undoButton = ControlBarButtonView.create(root, Icons.undo, i18n('controlBar.undo', 'Undo'));
			redoButton = ControlBarButtonView.create(root, Icons.redo, i18n('controlBar.redo', 'Redo'));
		}

		let disableDragButton: ControlBarButtonView | null = null;
		if (!isDisableDragDisabled) {
			disableDragButton = ControlBarButtonView.create(
				root,
				Icons.move,
				i18n('controlBar.turnOnOffDragAndDrop', 'Turn on/off drag and drop')
			);
			disableDragButton.setIsDisabled(true);
		}

		const deleteButton = ControlBarButtonView.create(
			root,
			Icons.delete,
			i18n('controlBar.deleteSelectedStep', 'Delete selected step'),
			'sqd-delete'
		);
		deleteButton.setIsHidden(true);

		const addon = addonFactory ? addonFactory(root) : null;

		parent.appendChild(root);
		return new ControlBarView(resetButton, zoomInButton, zoomOutButton, undoButton, redoButton, disableDragButton, deleteButton, addon);
	}

	private constructor(
		private readonly resetButton: ControlBarButtonView,
		private readonly zoomInButton: ControlBarButtonView,
		private readonly zoomOutButton: ControlBarButtonView,
		private readonly undoButton: ControlBarButtonView | null,
		private readonly redoButton: ControlBarButtonView | null,
		private readonly disableDragButton: ControlBarButtonView | null,
		private readonly deleteButton: ControlBarButtonView,
		private readonly addon: ControlBarAddon | null
	) {}

	public bindResetButtonClick(handler: () => void) {
		this.resetButton.bindClick(handler);
	}

	public bindZoomInButtonClick(handler: () => void) {
		this.zoomInButton.bindClick(handler);
	}

	public bindZoomOutButtonClick(handler: () => void) {
		this.zoomOutButton.bindClick(handler);
	}

	public tryBindUndoButtonClick(handler: () => void) {
		this.undoButton?.bindClick(handler);
	}

	public tryBindRedoButtonClick(handler: () => void) {
		this.redoButton?.bindClick(handler);
	}

	public tryBindDisableDragButtonClick(handler: () => void) {
		this.disableDragButton?.bindClick(handler);
	}

	public bindDeleteButtonClick(handler: () => void) {
		this.deleteButton.bindClick(handler);
	}

	public setIsDeleteButtonHidden(isHidden: boolean) {
		this.deleteButton.setIsHidden(isHidden);
	}

	public trySetDisableDragButtonDisabled(isDisabled: boolean) {
		this.disableDragButton?.setIsDisabled(isDisabled);
	}

	public trySetUndoButtonDisabled(isDisabled: boolean) {
		this.undoButton?.setIsDisabled(isDisabled);
	}

	public trySetRedoButtonDisabled(isDisabled: boolean) {
		this.redoButton?.setIsDisabled(isDisabled);
	}

	public tryRefreshAddon() {
		this.addon?.refresh();
	}
}
