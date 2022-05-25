import { Dom } from '../core/dom';
import { Step } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { Editor, EditorView } from './editor';

export class StepEditor implements Editor {

	public static create(step: Step, configuration: DesignerConfiguration): StepEditor {
		const content = configuration.stepEditorProvider(step);
		const view = StepEditorView.create(content);
		return new StepEditor(view);
	}

	private constructor(
		public readonly view: StepEditorView) {
	}
}

class StepEditorView implements EditorView {

	public static create(content: HTMLElement): StepEditorView {
		const root = Dom.element('div', {
			class: 'sqd-step-editor'
		});
		root.appendChild(content);
		return new StepEditorView(root);
	}

	private constructor(
		public readonly root: HTMLElement) {
	}
}
