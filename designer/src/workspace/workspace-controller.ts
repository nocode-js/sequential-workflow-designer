import { Vector } from '../core';
import { Placeholder, StepComponent } from './component';

export interface WorkspaceController {
	getPlaceholders(): Placeholder[];
	getComponentByStepId(stepId: string): StepComponent;
	refreshSize(): void;
	getCanvasPosition(): Vector;
	getCanvasSize(): Vector;
	getRootComponentSize(): Vector;
}

export class WorkspaceControllerWrapper implements WorkspaceController {
	private controller?: WorkspaceController;

	public set(controller: WorkspaceController) {
		if (this.controller) {
			throw new Error('Controller is already set');
		}
		this.controller = controller;
	}

	private get(): WorkspaceController {
		if (!this.controller) {
			throw new Error('Controller is not set');
		}
		return this.controller;
	}

	public getPlaceholders(): Placeholder[] {
		return this.get().getPlaceholders();
	}

	public getComponentByStepId(stepId: string): StepComponent {
		return this.get().getComponentByStepId(stepId);
	}

	public refreshSize() {
		this.get().refreshSize();
	}

	public getCanvasPosition(): Vector {
		return this.get().getCanvasPosition();
	}

	public getCanvasSize(): Vector {
		return this.get().getCanvasSize();
	}

	public getRootComponentSize(): Vector {
		return this.get().getRootComponentSize();
	}
}
