import { Vector } from '../core';
import { ViewPortController } from '../designer-extension';
import { WorkspaceControllerWrapper } from '../workspace/workspace-controller';

export class ViewPortApi {
	public constructor(
		private readonly workspaceController: WorkspaceControllerWrapper,
		private readonly viewPortController: ViewPortController
	) {}

	public resetViewPort() {
		this.viewPortController.setDefault();
	}

	public zoom(direction: boolean) {
		this.viewPortController.zoom(direction);
	}

	public moveViewPortToStep(stepId: string) {
		const component = this.workspaceController.getComponentByStepId(stepId);
		const componentPosition = component.view.getClientPosition();
		const componentSize = new Vector(component.view.width, component.view.height);
		this.viewPortController.focusOnComponent(componentPosition, componentSize);
	}
}
