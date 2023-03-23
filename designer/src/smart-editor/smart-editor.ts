import { DesignerApi } from '../api/designer-api';
import { WorkspaceApi } from '../api/workspace-api';
import { UiComponent } from '../designer-extension';
import { SmartEditorView } from './smart-editor-view';
import { EditorsConfiguration } from '../designer-configuration';

export class SmartEditor implements UiComponent {
	public static create(parent: HTMLElement, api: DesignerApi, configuration: EditorsConfiguration): SmartEditor {
		const view = SmartEditorView.create(parent, api, configuration);
		view.setIsCollapsed(api.editor.isVisibleAtStart());

		const editor = new SmartEditor(view, api.workspace);
		view.bindToggleIsCollapsedClick(() => editor.toggleIsCollapsedClick());

		return editor;
	}

	private isCollapsed?: boolean;

	private constructor(private readonly view: SmartEditorView, private workspaceApi: WorkspaceApi) {}

	private setIsCollapsed(isCollapsed: boolean) {
		this.isCollapsed = isCollapsed;
		this.view.setIsCollapsed(isCollapsed);
	}

	private toggleIsCollapsedClick() {
		this.setIsCollapsed(!this.isCollapsed);
		this.workspaceApi.updateSize();
	}

	public destroy() {
		this.view.destroy();
	}
}
