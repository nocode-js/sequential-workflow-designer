import { Vector } from '../core';
import { ViewportController } from '../designer-extension';
import { ViewportAnimator } from '../workspace/viewport/viewport-animator';
import { ZoomByWheelCalculator } from '../workspace/viewport/zoom-by-wheel-calculator';
import { WorkspaceControllerWrapper } from '../workspace/workspace-controller';
import { WorkspaceApi } from './workspace-api';

export class ViewportApi {
	private readonly animator = new ViewportAnimator(this.api);

	public constructor(
		private readonly workspaceController: WorkspaceControllerWrapper,
		private readonly viewportController: ViewportController,
		private readonly api: WorkspaceApi
	) {}

	public limitScale(scale: number): number {
		return this.viewportController.limitScale(scale);
	}

	public resetViewport() {
		const defaultViewport = this.viewportController.getDefault();
		this.api.setViewport(defaultViewport);
	}

	public zoom(direction: boolean) {
		const viewport = this.viewportController.getZoomed(direction);
		if (viewport) {
			this.api.setViewport(viewport);
		}
	}

	public moveViewportToStep(stepId: string) {
		const component = this.workspaceController.getComponentByStepId(stepId);
		const canvasPosition = this.workspaceController.getCanvasPosition();

		const clientPosition = component.view.getClientPosition();
		const componentPosition = clientPosition.subtract(canvasPosition);

		const componentSize = new Vector(component.view.width, component.view.height);
		const viewport = this.viewportController.getFocusedOnComponent(componentPosition, componentSize);
		this.animator.execute(viewport);
	}

	public handleWheelEvent(e: WheelEvent) {
		const viewport = this.api.getViewport();
		const canvasPosition = this.api.getCanvasPosition();

		const newViewport = ZoomByWheelCalculator.calculate(this.viewportController, viewport, canvasPosition, e);
		if (newViewport) {
			this.api.setViewport(newViewport);
		}
	}
}
