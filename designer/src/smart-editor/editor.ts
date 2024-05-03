import { Step } from '../definition';
import { EditorRenderer } from '../api/editor-renderer';
import { EditorView } from './editor-view';
import { RootEditorProvider, StepEditorProvider } from '../designer-configuration';
import { EditorApi, SelectedStepIdProvider } from '../api';

export class Editor {
	public static create(
		parent: HTMLElement,
		api: EditorApi,
		stepEditorClassName: string,
		stepEditorProvider: StepEditorProvider,
		rootEditorClassName: string,
		rootEditorProvider: RootEditorProvider,
		customSelectedStepIdProvider: SelectedStepIdProvider | null
	): Editor {
		const view = EditorView.create(parent);

		function render(step: Step | null) {
			const definition = api.getDefinition();
			let content: HTMLElement;
			let className: string;
			if (step) {
				const stepContext = api.createStepEditorContext(step.id);
				content = stepEditorProvider(step, stepContext, definition, api.isReadonly());
				className = stepEditorClassName;
			} else {
				const rootContext = api.createRootEditorContext();
				content = rootEditorProvider(definition, rootContext, api.isReadonly());
				className = rootEditorClassName;
			}
			view.setContent(content, className);
		}

		const renderer = api.runRenderer(step => render(step), customSelectedStepIdProvider);
		return new Editor(view, renderer);
	}

	private constructor(
		private readonly view: EditorView,
		private readonly renderer: EditorRenderer
	) {}

	public destroy() {
		this.view.destroy();
		this.renderer.destroy();
	}
}
