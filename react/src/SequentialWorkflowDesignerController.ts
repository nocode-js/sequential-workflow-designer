import { DependencyList, useMemo } from 'react';
import { Designer } from 'sequential-workflow-designer';

export class SequentialWorkflowDesignerController {
	public static create(): SequentialWorkflowDesignerController {
		return new SequentialWorkflowDesignerController();
	}

	private designer: Designer | null = null;

	private constructor() {
		// Nothing...
	}

	/**
	 * @description Moves the viewport to the step with the animation.
	 */
	public readonly moveViewportToStep = (stepId: string) => {
		this.getDesigner().moveViewportToStep(stepId);
	};

	/**
	 * @description Updates all badges.
	 */
	public readonly updateBadges = () => {
		this.getDesigner().updateBadges();
	};

	/**
	 * @description Rerender the root component and all its children.
	 */
	public readonly updateRootComponent = () => {
		this.getDesigner().updateRootComponent();
	};

	/**
	 * @returns `true` if the controller is ready to be used, `false` otherwise.
	 */
	public isReady(): boolean {
		return !!this.designer;
	}

	public setDesigner(designer: Designer | null) {
		if (designer && this.designer) {
			throw new Error('Designer is already set');
		}
		this.designer = designer;
	}

	private getDesigner(): Designer {
		if (!this.designer) {
			throw new Error('Designer is not ready yet');
		}
		return this.designer;
	}
}

export function useSequentialWorkflowDesignerController(deps?: DependencyList): SequentialWorkflowDesignerController {
	return useMemo(() => SequentialWorkflowDesignerController.create(), deps || []);
}
