import { Vector } from '../core';
import { Viewport } from '../designer-extension';
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

	public getViewport(): Viewport {
		return this.state.viewport;
	}

	public setViewport(viewport: Viewport) {
		this.state.setViewport(viewport);
	}

	public updateRootComponent() {
		this.workspaceController.updateRootComponent();
	}

	public updateBadges() {
		this.workspaceController.updateBadges();
	}

	public updateCanvasSize() {
		this.workspaceController.updateCanvasSize();
	}
}
