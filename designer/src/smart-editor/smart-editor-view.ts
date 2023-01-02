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

		parent.appendChild(toggle);
		parent.appendChild(root);
		return new SmartEditorView(root, toggle);
	}

	private view?: EditorView;
	private toggleIcon?: SVGElement;

	private constructor(private readonly root: HTMLElement, private readonly toggle: HTMLElement) {}

	public bindToggleIsCollapsedClick(handler: () => void) {
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

	public setView(view: EditorView) {
		if (this.view) {
			this.root.removeChild(this.view.root);
		}
		this.root.appendChild(view.root);
		this.view = view;
	}
}
