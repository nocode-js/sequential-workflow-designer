import { ControlBarView } from './control-bar-view';
import { UiComponent } from '../designer-extension';
import { ControlBarApi } from '../api/control-bar-api';
import { DesignerApi } from '../api/designer-api';
import { ViewportApi } from '../api';

export type ControlBarAddonFactory = (parent: HTMLElement) => ControlBarAddon | null;

export interface ControlBarAddon {
	refresh(): void;
}

export class ControlBar implements UiComponent {
	public static create(
		parent: HTMLElement,
		api: DesignerApi,
		isDisableDragDisabled: boolean,
		addonFactory: ControlBarAddonFactory | null
	): ControlBar {
		const isUndoRedoSupported = api.controlBar.isUndoRedoSupported();

		const view = ControlBarView.create(parent, isUndoRedoSupported, isDisableDragDisabled, api.i18n, addonFactory);
		const bar = new ControlBar(view, api.controlBar, api.viewport, isUndoRedoSupported, isDisableDragDisabled);

		view.bindResetButtonClick(bar.onResetButtonClicked);
		view.bindZoomInButtonClick(bar.onZoomInButtonClicked);
		view.bindZoomOutButtonClick(bar.onZoomOutButtonClicked);
		view.bindDeleteButtonClick(bar.onDeleteButtonClicked);
		api.controlBar.onStateChanged.subscribe(bar.refresh);

		if (isUndoRedoSupported) {
			view.tryBindUndoButtonClick(bar.onUndoButtonClicked);
			view.tryBindRedoButtonClick(bar.onRedoButtonClicked);
		}
		if (!isDisableDragDisabled) {
			view.tryBindDisableDragButtonClick(bar.onDisableDragButtonClicked);
		}

		bar.refresh();
		return bar;
	}

	private constructor(
		private readonly view: ControlBarView,
		private readonly controlBarApi: ControlBarApi,
		private readonly viewportApi: ViewportApi,
		private readonly isUndoRedoSupported: boolean,
		private readonly isDisableDragDisabled: boolean
	) {}

	public updateLayout() {
		//
	}

	public tryUpdateAddon() {
		this.view.tryRefreshAddon();
	}

	public destroy() {
		//
	}

	private readonly onResetButtonClicked = () => {
		this.viewportApi.resetViewport();
	};

	private readonly onZoomInButtonClicked = () => {
		this.viewportApi.zoom(true);
	};

	private readonly onZoomOutButtonClicked = () => {
		this.viewportApi.zoom(false);
	};

	private readonly onDisableDragButtonClicked = () => {
		this.controlBarApi.toggleIsDragDisabled();
	};

	private readonly onUndoButtonClicked = () => {
		this.controlBarApi.tryUndo();
	};

	private readonly onRedoButtonClicked = () => {
		this.controlBarApi.tryRedo();
	};

	private readonly onDeleteButtonClicked = () => {
		this.controlBarApi.tryDelete();
	};

	private readonly refresh = () => {
		this.refreshDeleteButtonVisibility();
		this.tryRefreshIsDragDisabled();
		this.tryRefreshUndoRedoAvailability();
		this.tryUpdateAddon();
	};

	//

	private tryRefreshIsDragDisabled() {
		if (!this.isDisableDragDisabled) {
			const isDragDisabled = this.controlBarApi.isDragDisabled();
			this.view.trySetDisableDragButtonDisabled(!isDragDisabled);
		}
	}

	private tryRefreshUndoRedoAvailability() {
		if (this.isUndoRedoSupported) {
			const canUndo = this.controlBarApi.canUndo();
			const canRedo = this.controlBarApi.canRedo();
			this.view.trySetUndoButtonDisabled(!canUndo);
			this.view.trySetRedoButtonDisabled(!canRedo);
		}
	}

	private refreshDeleteButtonVisibility() {
		const canDelete = this.controlBarApi.canDelete();
		this.view.setIsDeleteButtonHidden(!canDelete);
	}
}
