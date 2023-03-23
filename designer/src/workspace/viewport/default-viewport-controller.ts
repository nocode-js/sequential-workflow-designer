import { WorkspaceApi } from '../../api';
import { Vector } from '../../core';
import { Viewport, ViewportController } from '../../designer-extension';
import { CenteredViewportCalculator } from './centered-viewport-calculator';
import { QuantifiedScaleViewportCalculator } from './quantified-scale-viewport-calculator';
import { ViewportAnimator } from './viewport-animator';

const CENTER_MARGIN = 10;

export class DefaultViewportController implements ViewportController {
	public static create(api: WorkspaceApi): DefaultViewportController {
		return new DefaultViewportController(api);
	}

	private readonly animator = new ViewportAnimator(this.api);

	private constructor(private readonly api: WorkspaceApi) {}

	public setDefault() {
		const rootComponentSize = this.api.getRootComponentSize();
		const canvasSize = this.api.getCanvasSize();

		const target = CenteredViewportCalculator.center(CENTER_MARGIN, canvasSize, rootComponentSize);
		this.api.setViewport(target);
	}

	public zoom(direction: boolean) {
		const viewport = this.api.getViewport();

		const target = QuantifiedScaleViewportCalculator.zoom(viewport, direction);
		this.api.setViewport(target);
	}

	public focusOnComponent(componentPosition: Vector, componentSize: Vector) {
		const viewport = this.api.getViewport();
		const canvasSize = this.api.getCanvasSize();

		const target = CenteredViewportCalculator.focusOnComponent(canvasSize, viewport, componentPosition, componentSize);
		this.animateTo(target);
	}

	public animateTo(viewport: Viewport) {
		this.animator.execute(viewport);
	}
}
