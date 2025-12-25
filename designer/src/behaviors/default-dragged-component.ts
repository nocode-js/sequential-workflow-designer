import { Step } from '../definition';
import { ComponentContext } from '../component-context';
import { Dom } from '../core';
import { DraggedComponent, StepContext } from '../designer-extension';

// We need some padding around the step component to make sure shadows are not clipped.
const PADDING = 10;

export class DefaultDraggedComponent implements DraggedComponent {
	public static create(
		parent: HTMLElement,
		step: Step,
		isAttached: boolean,
		componentContext: ComponentContext
	): DefaultDraggedComponent {
		const scale = isAttached ? componentContext.getViewportScale() : 1;

		const canvas = Dom.svg('svg');
		parent.appendChild(canvas);

		const previewStepContext: StepContext = {
			parentSequence: [],
			step,
			depth: 0,
			position: 0,
			isInputConnected: true,
			isOutputConnected: true,
			isPreview: true
		};
		const stepComponent = componentContext.stepComponentFactory.create(canvas, previewStepContext, componentContext);

		Dom.attrs(canvas, {
			width: stepComponent.view.width + PADDING * 2,
			height: stepComponent.view.height + PADDING * 2,
			style: `transform: scale(${scale}) translate(${-PADDING}px, ${-PADDING}px); transform-origin: 0 0;`
		});
		Dom.translate(stepComponent.view.g, PADDING, PADDING);
		return new DefaultDraggedComponent(stepComponent.view.width, stepComponent.view.height, scale);
	}

	private constructor(
		public readonly width: number,
		public readonly height: number,
		public readonly scale: number
	) {}

	public destroy() {
		// Nothing to destroy...
	}
}
