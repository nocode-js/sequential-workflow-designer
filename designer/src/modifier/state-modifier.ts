import { Uid } from '../core';
import { SequenceModifier } from './sequence-modifier';
import { StepDuplicator } from '../core/step-duplicator';
import { Definition, DefinitionWalker, Sequence, Step } from '../definition';
import { DefinitionChangeType, DesignerConfiguration } from '../designer-configuration';
import { DesignerState } from '../designer-state';
import { StateModifierDependency } from './state-modifier-dependency';
import { FolderPathDefinitionModifierDependency } from './folder-path-definition-modifier-dependency';
import { SelectedStepIdDefinitionModifierDependency } from './selected-step-id-definition-modifier-dependency';

export class StateModifier {
	public static create(definitionWalker: DefinitionWalker, state: DesignerState, configuration: DesignerConfiguration): StateModifier {
		const dependencies: StateModifierDependency[] = [];
		dependencies.push(new SelectedStepIdDefinitionModifierDependency(state, definitionWalker));
		dependencies.push(new FolderPathDefinitionModifierDependency(state, definitionWalker));
		return new StateModifier(definitionWalker, state, configuration, dependencies);
	}

	public constructor(
		private readonly definitionWalker: DefinitionWalker,
		private readonly state: DesignerState,
		private readonly configuration: DesignerConfiguration,
		private readonly dependencies: StateModifierDependency[]
	) {}

	public addDependency(dependency: StateModifierDependency) {
		this.dependencies.push(dependency);
	}

	public isSelectable(step: Step, parentSequence: Sequence): boolean {
		return this.configuration.steps.isSelectable ? this.configuration.steps.isSelectable(step, parentSequence) : true;
	}

	public trySelectStep(step: Step, parentSequence: Sequence) {
		if (this.isSelectable(step, parentSequence)) {
			this.state.setSelectedStepId(step.id);
		}
	}

	public trySelectStepById(stepId: string) {
		if (this.configuration.steps.isSelectable) {
			const result = this.definitionWalker.getParentSequence(this.state.definition, stepId);
			this.trySelectStep(result.step, result.parentSequence);
		} else {
			this.state.setSelectedStepId(stepId);
		}
	}

	public isDeletable(stepId: string): boolean {
		if (this.configuration.steps.isDeletable) {
			const result = this.definitionWalker.getParentSequence(this.state.definition, stepId);
			return this.configuration.steps.isDeletable(result.step, result.parentSequence);
		}
		return true;
	}

	public tryDelete(stepId: string): boolean {
		const result = this.definitionWalker.getParentSequence(this.state.definition, stepId);

		const canDeleteStep = this.configuration.steps.canDeleteStep
			? this.configuration.steps.canDeleteStep(result.step, result.parentSequence)
			: true;
		if (!canDeleteStep) {
			return false;
		}

		SequenceModifier.deleteStep(result.step, result.parentSequence);
		this.state.notifyDefinitionChanged(DefinitionChangeType.stepDeleted, result.step.id);

		this.updateDependencies();
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

		if (!this.configuration.steps.isAutoSelectDisabled) {
			this.trySelectStepById(step.id);
		}
		return true;
	}

	public isDraggable(step: Step, parentSequence: Sequence): boolean {
		return this.configuration.steps.isDraggable ? this.configuration.steps.isDraggable(step, parentSequence) : true;
	}

	public tryMove(sourceSequence: Sequence, step: Step, targetSequence: Sequence, targetIndex: number): boolean {
		const apply = SequenceModifier.tryMoveStep(sourceSequence, step, targetSequence, targetIndex);
		if (!apply) {
			return false;
		}

		const canMoveStep = this.configuration.steps.canMoveStep
			? this.configuration.steps.canMoveStep(sourceSequence, step, targetSequence, targetIndex)
			: true;
		if (!canMoveStep) {
			return false;
		}

		apply();
		this.state.notifyDefinitionChanged(DefinitionChangeType.stepMoved, step.id);

		if (!this.configuration.steps.isAutoSelectDisabled) {
			this.trySelectStep(step, targetSequence);
		}
		return true;
	}

	public isDuplicable(step: Step, parentSequence: Sequence): boolean {
		return this.configuration.steps.isDuplicable ? this.configuration.steps.isDuplicable(step, parentSequence) : false;
	}

	public tryDuplicate(step: Step, parentSequence: Sequence): boolean {
		const uidGenerator = this.configuration.uidGenerator ? this.configuration.uidGenerator : Uid.next;
		const duplicator = new StepDuplicator(uidGenerator, this.definitionWalker);

		const index = parentSequence.indexOf(step);
		const newStep = duplicator.duplicate(step);

		return this.tryInsert(newStep, parentSequence, index + 1);
	}

	public replaceDefinition(definition: Definition) {
		if (!definition) {
			throw new Error('Definition is empty');
		}

		this.state.setDefinition(definition);
		this.updateDependencies();
	}

	public updateDependencies() {
		this.dependencies.forEach(dependency => dependency.update());
	}
}
