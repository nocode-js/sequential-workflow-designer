import { DependencyList, useMemo } from 'react';
import { Definition, Designer, SimpleEvent } from 'sequential-workflow-designer';

export class SequentialWorkflowDesignerController {
	public static create(): SequentialWorkflowDesignerController {
		return new SequentialWorkflowDesignerController();
	}

	/**
	 * @description Event that is raised when the controller is ready to be used.
	 */
	public readonly onIsReadyChanged = new SimpleEvent<void>();

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
	 * @description Updates the layout of the designer.
	 */
	public readonly updateLayout = () => {
		this.getDesigner().updateLayout();
	};

	/**
	 * Replaces the current definition with a new one and adds the previous definition to the undo stack.
	 * @param definition A new definition.
	 */
	public readonly replaceDefinition = (definition: Definition): Promise<void> => {
		return this.getDesigner().replaceDefinition(definition);
	};

	/**
	 * @returns `true` if the controller is ready to be used, `false` otherwise.
	 */
	public isReady(): boolean {
		return Boolean(this.designer);
	}

	public setDesigner(designer: Designer | null) {
		if (designer && this.designer) {
			throw new Error('Designer is already set');
		}
		this.designer = designer;
		this.onIsReadyChanged.forward();
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
