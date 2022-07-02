import { Dom } from '../core/dom';
import { Icons } from '../core/icons';
import { EditorView } from './editor';

export class SmartEditorView {
	public static create(parent: HTMLElement): SmartEditorView {
		const root = Dom.element('div', {
			class: 'sqd-smart-editor'
		});

		const toggle = Dom.element('div', {
			class: 'sqd-smart-editor-toggle',
			title: 'Toggle editor'
		});

		const toggleIcon = Icons.create('sqd-smart-editor-toggle-icon');
		toggle.appendChild(toggleIcon);

		parent.appendChild(toggle);
		parent.appendChild(root);
		return new SmartEditorView(root, toggle, toggleIcon);
	}

	private view?: EditorView;

	private constructor(
		private readonly root: HTMLElement,
		private readonly toggle: HTMLElement,
		private readonly toggleIcon: SVGElement
	) {}

	public bindToggleIsCollapsedClick(handler: () => void) {
		this.toggle.addEventListener('click', e => {
			e.preventDefault();
			handler();
		});
	}

	public setIsCollapsed(isCollapsed: boolean) {
		Dom.toggleClass(this.root, isCollapsed, 'sqd-hidden');
		Dom.toggleClass(this.toggle, isCollapsed, 'sqd-collapsed');
		this.toggleIcon.innerHTML = isCollapsed ? Icons.options : Icons.close;
	}

	public setView(view: EditorView) {
		if (this.view) {
			this.root.removeChild(this.view.root);
		}
		this.root.appendChild(view.root);
		this.view = view;
	}
}
