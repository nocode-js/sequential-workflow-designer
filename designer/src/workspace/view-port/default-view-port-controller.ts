import { WorkspaceApi } from '../../api';
import { Vector } from '../../core';
import { ViewPort, ViewPortController } from '../../designer-extension';
import { CenteredViewPortCalculator } from './centered-view-port-calculator';
import { QuantifiedScaleViewPortCalculator } from './quantified-scale-view-port-calculator';
import { ViewPortAnimator } from './view-port-animator';

const CENTER_MARGIN = 10;

export class DefaultViewPortController implements ViewPortController {
	public static create(api: WorkspaceApi): DefaultViewPortController {
		return new DefaultViewPortController(api);
	}

	private readonly animator = new ViewPortAnimator(this.api);

	private constructor(private readonly api: WorkspaceApi) {}

	public setDefault() {
		const rootComponentSize = this.api.getRootComponentSize();
		const canvasSize = this.api.getCanvasSize();

		const target = CenteredViewPortCalculator.center(CENTER_MARGIN, canvasSize, rootComponentSize);
		this.api.setViewPort(target);
	}

	public zoom(direction: boolean) {
		const viewPort = this.api.getViewPort();

		const target = QuantifiedScaleViewPortCalculator.zoom(viewPort, direction);
		this.api.setViewPort(target);
	}

	public focusOnComponent(componentPosition: Vector, componentSize: Vector) {
		const viewPort = this.api.getViewPort();
		const canvasSize = this.api.getCanvasSize();

		const target = CenteredViewPortCalculator.focusOnComponent(canvasSize, viewPort, componentPosition, componentSize);
		this.animateTo(target);
	}

	public animateTo(viewPort: ViewPort) {
		this.animator.execute(viewPort);
	}
}
