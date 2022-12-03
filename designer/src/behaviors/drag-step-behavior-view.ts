import { Dom } from '../core/dom';
import { Vector } from '../core/vector';
import { Sequence, Step } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { StepComponentFactory } from '../workspace/step-component-factory';

const SAFE_OFFSET = 10;

export class DragStepView {
	public static create(step: Step, configuration: DesignerConfiguration): DragStepView {
		const theme = configuration.theme || 'light';
		const layer = Dom.element('div', {
			class: `sqd-drag sqd-theme-${theme}`
		});
		document.body.appendChild(layer);

		const canvas = Dom.svg('svg');
		layer.appendChild(canvas);

		const fakeSequence: Sequence = [];
		const stepComponent = StepComponentFactory.create(canvas, step, fakeSequence, configuration.steps);

		Dom.attrs(canvas, {
			width: stepComponent.view.width + SAFE_OFFSET * 2,
			height: stepComponent.view.height + SAFE_OFFSET * 2
		});

		Dom.translate(stepComponent.view.g, SAFE_OFFSET, SAFE_OFFSET);

		return new DragStepView(stepComponent.view.width, stepComponent.view.height, layer);
	}

	private constructor(public readonly width: number, public readonly height: number, private readonly layer: HTMLElement) {}

	public setPosition(position: Vector) {
		this.layer.style.top = position.y - SAFE_OFFSET + 'px';
		this.layer.style.left = position.x - SAFE_OFFSET + 'px';
	}

	public remove() {
		document.body.removeChild(this.layer);
	}
}
