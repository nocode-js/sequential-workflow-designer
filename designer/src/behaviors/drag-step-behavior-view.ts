import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { ComponentContext } from '../component-context';
import { DraggedComponent } from '../designer-extension';

export class DragStepView {
	public static create(step: Step, isAttached: boolean, theme: string, componentContext: ComponentContext): DragStepView {
		const body = componentContext.shadowRoot ?? document.body;
		const layer = Dom.element('div', {
			class: `sqd-drag sqd-theme-${theme}`
		});
		body.appendChild(layer);

		const component = componentContext.services.draggedComponent.create(layer, step, isAttached, componentContext);

		return new DragStepView(component, layer, body);
	}

	private constructor(
		public readonly component: DraggedComponent,
		private readonly layer: HTMLElement,
		private readonly body: Node
	) {}

	public setPosition(position: Vector) {
		this.layer.style.top = position.y + 'px';
		this.layer.style.left = position.x + 'px';
	}

	public remove() {
		this.component.destroy();
		this.body.removeChild(this.layer);
	}
}
