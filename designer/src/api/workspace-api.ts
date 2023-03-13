import { Vector } from '../core';
import { DesignerState, ViewPort } from '../designer-state';
import { WorkspaceControllerWrapper } from '../workspace/workspace-controller';

export class WorkspaceApi {
	public constructor(private readonly state: DesignerState, private readonly workspaceController: WorkspaceControllerWrapper) {}

	public getClientPosition(): Vector {
		return this.workspaceController.getClientPosition();
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
