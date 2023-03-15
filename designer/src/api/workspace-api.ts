import { Vector } from '../core';
import { ViewPort } from '../designer-extension';
import { DesignerState } from '../designer-state';
import { WorkspaceControllerWrapper } from '../workspace/workspace-controller';

export class WorkspaceApi {
	public constructor(private readonly state: DesignerState, private readonly workspaceController: WorkspaceControllerWrapper) {}

	public getCanvasPosition(): Vector {
		return this.workspaceController.getCanvasPosition();
	}

	public getCanvasSize(): Vector {
		return this.workspaceController.getCanvasSize();
	}

	public getRootComponentSize(): Vector {
		return this.workspaceController.getRootComponentSize();
	}

	public getViewPort(): ViewPort {
		return this.state.viewPort;
	}

	public setViewPort(viewPort: ViewPort) {
		this.state.setViewPort(viewPort);
	}

	public refreshSize() {
		this.workspaceController.refreshSize();
	}
}
