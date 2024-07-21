import { Vector } from '../core';
import { FoundPlaceholders } from './component';
import { StepComponent } from './step-component';

export interface WorkspaceController {
	resolvePlaceholders(skipComponent: StepComponent | undefined): FoundPlaceholders;
	getComponentByStepId(stepId: string): StepComponent;
	getCanvasPosition(): Vector;
	getCanvasSize(): Vector;
	getRootComponentSize(): Vector;
	updateBadges(): void;
	updateRootComponent(): void;
	updateCanvasSize(): void;
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

	public resolvePlaceholders(skipComponent: StepComponent | undefined): FoundPlaceholders {
		return this.get().resolvePlaceholders(skipComponent);
	}

	public getComponentByStepId(stepId: string): StepComponent {
		return this.get().getComponentByStepId(stepId);
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

	public updateBadges() {
		this.get().updateBadges();
	}

	public updateRootComponent() {
		this.get().updateRootComponent();
	}

	public updateCanvasSize() {
		this.get().updateCanvasSize();
	}
}
