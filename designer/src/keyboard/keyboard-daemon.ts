import { DesignerApi } from '../api/designer-api';
import { ControlBarApi } from '../api/control-bar-api';
import { Daemon } from '../designer-extension';
import { KeyboardAction, KeyboardConfiguration } from '../designer-configuration';

const ignoreTagNames = ['INPUT', 'TEXTAREA', 'SELECT'];

export class KeyboardDaemon implements Daemon {
	public static create(api: DesignerApi, configuration: KeyboardConfiguration): KeyboardDaemon {
		const controller = new KeyboardDaemon(api.documentOrShadowRoot, api.controlBar, configuration);
		api.documentOrShadowRoot.addEventListener('keyup', controller.onKeyUp, false);
		return controller;
	}

	private constructor(
		private readonly documentOrShadowRoot: Document | ShadowRoot,
		private readonly controlBarApi: ControlBarApi,
		private readonly configuration: KeyboardConfiguration
	) {}

	private readonly onKeyUp = (e: Event) => {
		const ke = e as KeyboardEvent;
		const action = detectAction(ke);
		if (!action) {
			return;
		}
		if (document.activeElement && ignoreTagNames.includes(document.activeElement.tagName)) {
			return;
		}
		if (this.configuration.canHandleKey && !this.configuration.canHandleKey(action, ke)) {
			return;
		}

		const isDeletable = this.controlBarApi.canDelete();
		if (isDeletable) {
			e.preventDefault();
			e.stopPropagation();

			this.controlBarApi.tryDelete();
		}
	};

	public destroy() {
		this.documentOrShadowRoot.removeEventListener('keyup', this.onKeyUp, false);
	}
}

function detectAction(e: KeyboardEvent): KeyboardAction | null {
	if (e.key === 'Backspace' || e.key === 'Delete') {
		return KeyboardAction.delete;
	}
	return null;
}
