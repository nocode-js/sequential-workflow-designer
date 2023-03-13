import { DesignerApi } from '../api/designer-api';
import { ControlBarApi } from '../api/control-bar-api';
import { Daemon } from '../designer-extension';

const supportedKeys = ['Backspace', 'Delete'];
const ignoreTagNames = ['INPUT', 'TEXTAREA'];

export class KeyboardDaemon implements Daemon {
	public static create(api: DesignerApi): KeyboardDaemon {
		const controller = new KeyboardDaemon(api.controlBar);
		document.addEventListener('keyup', controller.onKeyUp, false);
		return controller;
	}

	private constructor(private readonly controlBarApi: ControlBarApi) {}

	private readonly onKeyUp = (e: KeyboardEvent) => {
		if (!supportedKeys.includes(e.key)) {
			return;
		}
		if (document.activeElement && ignoreTagNames.includes(document.activeElement.tagName)) {
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
		document.removeEventListener('keyup', this.onKeyUp, false);
	}
}
