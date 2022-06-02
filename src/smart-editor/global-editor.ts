import { Definition } from '../definition';
import { GlobalEditorProvider } from '../designer-configuration';
import { Editor } from './editor';
import { GlobalEditorView } from './global-editor-view';

export class GlobalEditor implements Editor {

	public static create(definition: Definition, globalEditorProvider: GlobalEditorProvider): GlobalEditor {
		const content = globalEditorProvider(definition);
		const view = GlobalEditorView.create(content);
		return new GlobalEditor(view);
	}

	private constructor(
		public readonly view: GlobalEditorView) {
	}
}
