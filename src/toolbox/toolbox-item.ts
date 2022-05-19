import { SimpleEvent } from '../core/simple-event';

export class ToolboxItem {

	public static append(parent: HTMLElement): ToolboxItem {
		const item = document.createElement('div');
		item.className = 'sqd-toolbox-item';

		const text = document.createElement('span');
		text.className = 'sqd-toolbox-item-text';
		text.textContent = 'Test';

		item.appendChild(text);
		parent.appendChild(item);

		const i = new ToolboxItem();
		item.addEventListener('mousedown', e => i.onMouseDown(e));
		return i;
	}

	public readonly onDragStart = new SimpleEvent<ToolboxItem>();

	public onMouseDown(e: MouseEvent) {
		e.preventDefault();

		this.onDragStart.fire(this);
	}
}
