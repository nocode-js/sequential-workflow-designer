import { EditorApi } from '../api';
import { Dom } from '../core/dom';
import { Icons } from '../core/icons';
import { EditorsConfiguration } from '../designer-configuration';
import { Editor } from './editor';

export class SmartEditorView {
	public static create(parent: HTMLElement, api: EditorApi, configuration: EditorsConfiguration): SmartEditorView {
		const root = Dom.element('div', {
			class: 'sqd-smart-editor'
		});

		const toggle = Dom.element('div', {
			class: 'sqd-smart-editor-toggle',
			title: 'Toggle editor'
		});

		parent.appendChild(toggle);
		parent.appendChild(root);

		const editor = Editor.create(
			root,
			api,
			'sqd-editor sqd-step-editor',
			configuration.stepEditorProvider,
			'sqd-editor sqd-global-editor',
			configuration.globalEditorProvider
		);
		return new SmartEditorView(root, toggle, editor);
	}

	private toggleIcon?: SVGElement;

	private constructor(private readonly root: HTMLElement, private readonly toggle: HTMLElement, private readonly editor: Editor) {}

	public bindToggleClick(handler: () => void) {
		this.toggle.addEventListener(
			'click',
			e => {
				e.preventDefault();
				handler();
			},
			false
		);
	}

	public setIsCollapsed(isCollapsed: boolean) {
		Dom.toggleClass(this.root, isCollapsed, 'sqd-hidden');
		Dom.toggleClass(this.toggle, isCollapsed, 'sqd-collapsed');

		if (this.toggleIcon) {
			this.toggle.removeChild(this.toggleIcon);
		}
		this.toggleIcon = Icons.createSvg('sqd-smart-editor-toggle-icon', isCollapsed ? Icons.options : Icons.close);
		this.toggle.appendChild(this.toggleIcon);
	}

	public destroy() {
		this.editor.destroy();
	}
}
