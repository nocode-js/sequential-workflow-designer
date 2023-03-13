import { Step } from '../definition';
import { DesignerApi } from '../api/designer-api';
import { EditorRenderer } from '../api/editor-renderer';
import { EditorView } from './editor-view';
import { GlobalEditorProvider, StepEditorProvider } from '../designer-configuration';

export class Editor {
	public static create(
		parent: HTMLElement,
		api: DesignerApi,
		stepEditorClassName: string,
		stepEditorProvider: StepEditorProvider,
		globalEditorClassName: string,
		globalEditorProvider: GlobalEditorProvider
	): Editor {
		const view = EditorView.create(parent);

		function render(step: Step | null) {
			let content: HTMLElement;
			let className: string;
			if (step) {
				const stepContext = api.editor.createStepEditorContext(step.id);
				content = stepEditorProvider(step, stepContext);
				className = stepEditorClassName;
			} else {
				const globalContext = api.editor.createGlobalEditorContext();
				content = globalEditorProvider(api.editor.getDefinition(), globalContext);
				className = globalEditorClassName;
			}
			view.setContent(content, className);
		}

		const renderer = api.editor.runRenderer(step => render(step));
		return new Editor(view, renderer);
	}

	private constructor(private readonly view: EditorView, private readonly renderer: EditorRenderer) {}

	public destroy() {
		this.view.destroy();
		this.renderer.destroy();
	}
}
