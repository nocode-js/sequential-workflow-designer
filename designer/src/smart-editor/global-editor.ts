import { Definition } from '../definition';
import { GlobalEditorContext } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { DefinitionChangeType } from '../designer-state';
import { Editor } from './editor';
import { GlobalEditorView } from './global-editor-view';

export class GlobalEditor implements Editor {
	public static create(definition: Definition, context: DesignerContext): GlobalEditor {
		const editorContext: GlobalEditorContext = {
			notifyPropertiesChanged: () => {
				context.state.notifyDefinitionChanged(DefinitionChangeType.globalPropertyChanged, null);
			}
		};

		const content = context.configuration.editors.globalEditorProvider(definition, editorContext);
		const view = GlobalEditorView.create(content);
		return new GlobalEditor(view);
	}

	private constructor(public readonly view: GlobalEditorView) {}
}
