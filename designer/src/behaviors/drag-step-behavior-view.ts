import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { Step } from '../definition';
import { ComponentContext } from '../component-context';
import { DraggedComponent } from '../designer-extension';

export class DragStepView {
	public static create(step: Step, theme: string, componentContext: ComponentContext): DragStepView {
		const layer = Dom.element('div', {
			class: `sqd-drag sqd-theme-${theme}`
		});
		document.body.appendChild(layer);

		const component = componentContext.services.draggedComponent.create(layer, step, componentContext);

		return new DragStepView(component, layer);
	}

	private constructor(public readonly component: DraggedComponent, private readonly layer: HTMLElement) {}

	public setPosition(position: Vector) {
		this.layer.style.top = position.y + 'px';
		this.layer.style.left = position.x + 'px';
	}

	public remove() {
		this.component.destroy();
		document.body.removeChild(this.layer);
	}
}
