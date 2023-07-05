import { DesignerApi } from '../api/designer-api';
import { WorkspaceApi } from '../api/workspace-api';
import { UiComponent } from '../designer-extension';
import { SmartEditorView } from './smart-editor-view';
import { EditorsConfiguration } from '../designer-configuration';
import { EditorApi } from '../api';

export class SmartEditor implements UiComponent {
	public static create(parent: HTMLElement, api: DesignerApi, configuration: EditorsConfiguration): SmartEditor {
		const view = SmartEditorView.create(parent, api.editor, configuration);

		const editor = new SmartEditor(view, api.editor, api.workspace);
		editor.updateVisibility();
		view.bindToggleClick(() => editor.onToggleClicked());
		api.editor.subscribeIsCollapsed(() => editor.onIsCollapsedChanged());
		return editor;
	}

	private constructor(private readonly view: SmartEditorView, private editorApi: EditorApi, private workspaceApi: WorkspaceApi) {}

	private onToggleClicked() {
		this.editorApi.toggleIsCollapsed();
	}

	private setIsCollapsed(isCollapsed: boolean) {
		this.view.setIsCollapsed(isCollapsed);
	}

	private onIsCollapsedChanged() {
		this.updateVisibility();
		this.workspaceApi.updateCanvasSize();
	}

	private updateVisibility() {
		this.setIsCollapsed(this.editorApi.isCollapsed());
	}

	public destroy() {
		this.view.destroy();
	}
}
