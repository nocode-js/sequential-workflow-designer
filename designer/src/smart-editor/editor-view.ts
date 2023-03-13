import { Dom } from '../core';

export class EditorView {
	public static create(parent: HTMLElement): EditorView {
		return new EditorView(parent);
	}

	private currentContainer: HTMLElement | null = null;

	private constructor(private readonly parent: HTMLElement) {}

	public setContent(content: HTMLElement, className: string) {
		const container = Dom.element('div', {
			class: className
		});
		container.appendChild(content);

		if (this.currentContainer) {
			this.parent.removeChild(this.currentContainer);
		}
		this.parent.appendChild(container);
		this.currentContainer = container;
	}

	public destroy() {
		if (this.currentContainer) {
			this.parent.removeChild(this.currentContainer);
		}
	}
}
