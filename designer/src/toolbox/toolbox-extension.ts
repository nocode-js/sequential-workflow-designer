import { DesignerApi } from '../api/designer-api';
import { ToolboxConfiguration } from '../designer-configuration';
import { UiComponent, UiComponentExtension } from '../designer-extension';
import { Toolbox } from './toolbox';

export class ToolboxExtension implements UiComponentExtension {
	public constructor(private readonly configuration: ToolboxConfiguration) {}

	public create(root: HTMLElement, api: DesignerApi): UiComponent {
		return Toolbox.create(root, api, this.configuration);
	}
}
