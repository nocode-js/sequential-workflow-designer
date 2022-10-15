import { SequenceModifier } from './core/sequence-modifier';
import { StepsTraverser } from './core/steps-traverser';
import { Definition, Sequence, Step } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DefinitionChangeType, DesignerState } from './designer-state';
import { WorkspaceController } from './workspace/workspace-controller';

export class DefinitionModifier {
	public constructor(
		private readonly workspaceController: WorkspaceController,
		private readonly state: DesignerState,
		private readonly configuration: DesignerConfiguration
	) {}

	public tryDelete(step: Step): boolean {
		const component = this.workspaceController.getComponentByStepId(step.id);
		const canDeleteStep = this.configuration.steps.canDeleteStep
			? this.configuration.steps.canDeleteStep(component.step, component.parentSequence)
			: true;
		if (!canDeleteStep) {
			return false;
		}

		SequenceModifier.deleteStep(component.step, component.parentSequence);
		this.state.notifyDefinitionChanged(DefinitionChangeType.stepDeleted, component.step.id);
		if (this.state.selectedStep?.id === step.id) {
			this.state.setSelectedStep(null);
		}
		return true;
	}

	public tryInsert(step: Step, targetSequence: Sequence, targetIndex: number): boolean {
		const canInsertStep = this.configuration.steps.canInsertStep
			? this.configuration.steps.canInsertStep(step, targetSequence, targetIndex)
			: true;
		if (!canInsertStep) {
			return false;
		}

		SequenceModifier.insertStep(step, targetSequence, targetIndex);
		this.state.notifyDefinitionChanged(DefinitionChangeType.stepInserted, step.id);
		this.state.setSelectedStep(step);
		return true;
	}

	public tryMove(sourceSequence: Sequence, step: Step, targetSequence: Sequence, targetIndex: number): boolean {
		const canMoveStep = this.configuration.steps.canMoveStep
			? this.configuration.steps.canMoveStep(sourceSequence, step, targetSequence, targetIndex)
			: true;
		if (!canMoveStep) {
			return false;
		}

		SequenceModifier.moveStep(sourceSequence, step, targetSequence, targetIndex);
		this.state.notifyDefinitionChanged(DefinitionChangeType.stepMoved, step.id);
		this.state.setSelectedStep(step);
		return true;
	}

	public replaceDefinition(definition: Definition) {
		if (!definition) {
			throw new Error('Definition is empty');
		}

		this.state.setDefinition(definition);

		if (this.state.selectedStep) {
			// We need to update a reference of the selected step.
			const step = StepsTraverser.findById(definition, this.state.selectedStep.id);
			this.state.setSelectedStep(step);
		}
	}
}
