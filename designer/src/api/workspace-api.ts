import { DefinitionWalker, Sequence, StepChildrenType, StepWithParentSequence } from 'sequential-workflow-model';
import { Vector } from '../core';
import { Viewport } from '../designer-extension';
import { DesignerState } from '../designer-state';
import { WorkspaceControllerWrapper } from '../workspace/workspace-controller';

export class WorkspaceApi {
	public constructor(
		private readonly state: DesignerState,
		private readonly definitionWalker: DefinitionWalker,
		private readonly workspaceController: WorkspaceControllerWrapper
	) {}

	public getViewport(): Viewport {
		return this.state.viewport;
	}

	public setViewport(viewport: Viewport) {
		this.state.setViewport(viewport);
	}

	public getCanvasPosition(): Vector {
		return this.workspaceController.getCanvasPosition();
	}

	public getCanvasSize(): Vector {
		return this.workspaceController.getCanvasSize();
	}

	public getRootComponentSize(): Vector {
		return this.workspaceController.getRootComponentSize();
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

	public getRootSequence(): WorkspaceRootSequence {
		const stepId = this.state.tryGetLastStepIdFromFolderPath();
		if (stepId) {
			const parentStep = this.definitionWalker.getParentSequence(this.state.definition, stepId);
			const children = this.definitionWalker.getChildren(parentStep.step);
			if (!children || children.type !== StepChildrenType.sequence) {
				throw new Error('Cannot find single sequence in folder step');
			}
			return {
				sequence: children.items as Sequence,
				parentStep
			};
		}
		return {
			sequence: this.state.definition.sequence,
			parentStep: null
		};
	}
}

export interface WorkspaceRootSequence {
	sequence: Sequence;
	parentStep: StepWithParentSequence | null;
}
