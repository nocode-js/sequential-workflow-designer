import { Dom } from '../core/dom';
import { Definition } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { Editor, EditorView } from './editor';

export class GlobalEditor implements Editor {

	public static create(definition: Definition, configuration: DesignerConfiguration): GlobalEditor {
		const content = configuration.globalEditorProvider(definition);
		const view = GlobalEditorView.create(content);
		return new GlobalEditor(view);
	}

	private constructor(
		public readonly view: GlobalEditorView) {
	}
}

class GlobalEditorView implements EditorView {

	public static create(content: HTMLElement): GlobalEditorView {
		const se = Dom.element('div', {
			class: 'sqd-global-editor'
		});
		se.appendChild(content);
		return new GlobalEditorView(se);
	}

	private constructor(
		public readonly root: HTMLElement) {
	}
}
