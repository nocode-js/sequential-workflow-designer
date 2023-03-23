import { Step } from '../definition';
import { ComponentContext } from '../component-context';
import { Dom } from '../core';
import { DraggedComponent, StepContext } from '../designer-extension';

const SAFE_OFFSET = 10;

export class DefaultDraggedComponent implements DraggedComponent {
	public static create(parent: HTMLElement, step: Step, componentContext: ComponentContext): DefaultDraggedComponent {
		const canvas = Dom.svg('svg');
		canvas.style.marginLeft = -SAFE_OFFSET + 'px';
		canvas.style.marginTop = -SAFE_OFFSET + 'px';

		parent.appendChild(canvas);

		const fakeStepContext: StepContext = {
			parentSequence: [],
			step,
			depth: 0,
			position: 0,
			isInputConnected: true,
			isOutputConnected: true
		};
		const stepComponent = componentContext.stepComponentFactory.create(canvas, fakeStepContext, componentContext);

		Dom.attrs(canvas, {
			width: stepComponent.view.width + SAFE_OFFSET * 2,
			height: stepComponent.view.height + SAFE_OFFSET * 2
		});

		Dom.translate(stepComponent.view.g, SAFE_OFFSET, SAFE_OFFSET);
		return new DefaultDraggedComponent(stepComponent.view.width, stepComponent.view.height);
	}

	private constructor(public readonly width: number, public readonly height: number) {}

	public destroy() {
		// Nothing to destroy...
	}
}
