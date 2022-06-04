import { Step } from '../definition';
import { StepEditorProvider } from '../designer-configuration';
import { Editor } from './editor';
import { StepEditorView } from './step-editor-view';

export class StepEditor implements Editor {
	public static create(step: Step, stepEditorProvider: StepEditorProvider): StepEditor {
		const content = stepEditorProvider(step);
		const view = StepEditorView.create(content);
		return new StepEditor(view);
	}

	private constructor(public readonly view: StepEditorView) {}
}
