import { DesignerApi } from '../api';
import { UiComponentExtension } from '../designer-extension';
import { ControlBar } from './control-bar';

export class ControlBarExtension implements UiComponentExtension {
	public create(root: HTMLElement, api: DesignerApi) {
		return ControlBar.create(root, api, false, null);
	}
}
