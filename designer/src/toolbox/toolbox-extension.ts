import { DesignerApi } from '../api/designer-api';
import { UiComponent, UiComponentExtension } from '../designer-extension';
import { Toolbox } from './toolbox';

export class ToolboxExtension implements UiComponentExtension {
	public create(root: HTMLElement, api: DesignerApi): UiComponent {
		return Toolbox.create(root, api.toolbox);
	}
}
