import { Placeholder, StepComponent } from './component';

export interface WorkspaceController {
	getPlaceholders(): Placeholder[];
	getComponentByStepId(stepId: string): StepComponent;
	resetViewPort(): void;
	zoom(direction: boolean): void;
	moveViewPortToStep(stepComponent: StepComponent): void;
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

	public resetViewPort() {
		this.get().resetViewPort();
	}

	public zoom(direction: boolean) {
		this.get().zoom(direction);
	}

	public moveViewPortToStep(stepComponent: StepComponent) {
		this.get().moveViewPortToStep(stepComponent);
	}
}
