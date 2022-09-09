import { Step } from '../definition';
import { StepEditorContext } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { Editor } from './editor';
import { StepEditorView } from './step-editor-view';

export class StepEditor implements Editor {
	public static create(step: Step, context: DesignerContext): StepEditor {
		const editorContext: StepEditorContext = {
			notifyPropertiesChanged: () => {
				context.notifiyDefinitionChanged(false);
			},
			notifyNameChanged: () => {
				context.notifiyDefinitionChanged(true);
			}
		};

		const content = context.configuration.editors.stepEditorProvider(step, editorContext);
		const view = StepEditorView.create(content);
		return new StepEditor(view);
	}

	private constructor(public readonly view: StepEditorView) {}
}
