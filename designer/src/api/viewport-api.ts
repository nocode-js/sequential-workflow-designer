import { Vector } from '../core';
import { ViewportController } from '../designer-extension';
import { DesignerState } from '../designer-state';
import { ViewportAnimator } from '../workspace/viewport/viewport-animator';
import { ZoomByWheelCalculator } from '../workspace/viewport/zoom-by-wheel-calculator';
import { WorkspaceControllerWrapper } from '../workspace/workspace-controller';

export class ViewportApi {
	private readonly animator = new ViewportAnimator(this.state);

	public constructor(
		private readonly state: DesignerState,
		private readonly workspaceController: WorkspaceControllerWrapper,
		private readonly viewportController: ViewportController
	) {}

	public limitScale(scale: number): number {
		return this.viewportController.limitScale(scale);
	}

	public resetViewport() {
		const defaultViewport = this.viewportController.getDefault();
		this.state.setViewport(defaultViewport);
	}

	public zoom(direction: boolean) {
		const viewport = this.viewportController.getZoomed(direction);
		if (viewport) {
			this.state.setViewport(viewport);
		}
	}

	public moveViewportToStep(stepId: string) {
		const component = this.workspaceController.getComponentByStepId(stepId);
		const canvasPosition = this.workspaceController.getCanvasPosition();

		const clientPosition = component.view.getClientPosition();
		const componentPosition = clientPosition.subtract(canvasPosition);

		const componentSize = new Vector(component.view.width, component.view.height);
		const viewport = this.viewportController.getFocusedOnComponent(
			componentPosition,
			componentSize,
			component.step.componentType,
			component.view.g
		);
		this.animator.execute(viewport);
	}

	public handleWheelEvent(e: WheelEvent) {
		const canvasPosition = this.workspaceController.getCanvasPosition();

		const newViewport = ZoomByWheelCalculator.calculate(this.viewportController, this.state.viewport, canvasPosition, e);
		if (newViewport) {
			this.state.setViewport(newViewport);
		}
	}
}
