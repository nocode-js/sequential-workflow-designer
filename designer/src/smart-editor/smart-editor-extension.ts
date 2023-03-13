import { DesignerApi } from '../api/designer-api';
import { EditorsConfiguration } from '../designer-configuration';
import { UiComponent, UiComponentExtension } from '../designer-extension';
import { SmartEditor } from './smart-editor';

export class SmartEditorExtension implements UiComponentExtension {
	public constructor(private readonly configuration: EditorsConfiguration) {}

	public create(root: HTMLElement, api: DesignerApi): UiComponent {
		return SmartEditor.create(root, api, this.configuration);
	}
}
