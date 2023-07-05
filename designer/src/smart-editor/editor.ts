import { Step } from '../definition';
import { EditorRenderer } from '../api/editor-renderer';
import { EditorView } from './editor-view';
import { GlobalEditorProvider, StepEditorProvider } from '../designer-configuration';
import { EditorApi } from '../api';

export class Editor {
	public static create(
		parent: HTMLElement,
		api: EditorApi,
		stepEditorClassName: string,
		stepEditorProvider: StepEditorProvider,
		globalEditorClassName: string,
		globalEditorProvider: GlobalEditorProvider
	): Editor {
		const view = EditorView.create(parent);

		function render(step: Step | null) {
			const definition = api.getDefinition();
			let content: HTMLElement;
			let className: string;
			if (step) {
				const stepContext = api.createStepEditorContext(step.id);
				content = stepEditorProvider(step, stepContext, definition);
				className = stepEditorClassName;
			} else {
				const globalContext = api.createGlobalEditorContext();
				content = globalEditorProvider(definition, globalContext);
				className = globalEditorClassName;
			}
			view.setContent(content, className);
		}

		const renderer = api.runRenderer(step => render(step));
		return new Editor(view, renderer);
	}

	private constructor(private readonly view: EditorView, private readonly renderer: EditorRenderer) {}

	public destroy() {
		this.view.destroy();
		this.renderer.destroy();
	}
}
