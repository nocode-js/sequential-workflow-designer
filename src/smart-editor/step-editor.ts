import { Step } from '../definition';
import { Editor, EditorView } from './editor';

export class StepEditor implements Editor {

	public static create(step: Step): StepEditor {
		const view = StepEditorView.create(step);
		return new StepEditor(view);
	}

	private constructor(
		public readonly view: StepEditorView) {
	}
}

class StepEditorView implements EditorView {

	public static create(step: Step): StepEditorView {
		const se = document.createElement('div');
		se.className = 'sqd-step-editor';
		se.innerText = 'step editor: ' + step.name;
		return new StepEditorView(se);
	}

	private constructor(
		public readonly element: HTMLElement) {
	}
}
