import { SequenceModifier } from './sequence-modifier';
import { StepDuplicator } from '../core/step-duplicator';
import { Definition, DefinitionWalker, Sequence, Step } from '../definition';
import { DefinitionChangeType, StepsConfiguration, UidGenerator } from '../designer-configuration';
import { DesignerState } from '../designer-state';
import { StateModifierDependency } from './state-modifier-dependency';
import { FolderPathDefinitionModifierDependency } from './folder-path-definition-modifier-dependency';
import { SelectedStepIdDefinitionModifierDependency } from './selected-step-id-definition-modifier-dependency';

export class StateModifier {
	public static create(
		definitionWalker: DefinitionWalker,
		uidGenerator: UidGenerator,
		state: DesignerState,
		configuration: StepsConfiguration
	): StateModifier {
		const dependencies: StateModifierDependency[] = [];
		dependencies.push(new SelectedStepIdDefinitionModifierDependency(state, definitionWalker));
		dependencies.push(new FolderPathDefinitionModifierDependency(state, definitionWalker));
		return new StateModifier(definitionWalker, uidGenerator, state, configuration, dependencies);
	}

	public constructor(
		private readonly definitionWalker: DefinitionWalker,
		private readonly uidGenerator: UidGenerator,
		private readonly state: DesignerState,
		private readonly configuration: StepsConfiguration,
		private readonly dependencies: StateModifierDependency[]
	) {}

	public addDependency(dependency: StateModifierDependency) {
		this.dependencies.push(dependency);
	}

	public isSelectable(step: Step, parentSequence: Sequence): boolean {
		return this.configuration.isSelectable ? this.configuration.isSelectable(step, parentSequence) : true;
	}

	public trySelectStep(step: Step, parentSequence: Sequence) {
		if (this.isSelectable(step, parentSequence)) {
			this.state.setSelectedStepId(step.id);
		}
	}

	public trySelectStepById(stepId: string) {
		if (this.configuration.isSelectable) {
			const result = this.definitionWalker.getParentSequence(this.state.definition, stepId);
			this.trySelectStep(result.step, result.parentSequence);
		} else {
			this.state.setSelectedStepId(stepId);
		}
	}

	public isDeletable(stepId: string): boolean {
		if (this.configuration.isDeletable) {
			const result = this.definitionWalker.getParentSequence(this.state.definition, stepId);
			return this.configuration.isDeletable(result.step, result.parentSequence);
		}
		return true;
	}

	public tryDelete(stepId: string): boolean {
		const result = this.definitionWalker.getParentSequence(this.state.definition, stepId);

		const canDeleteStep = this.configuration.canDeleteStep
			? this.configuration.canDeleteStep(result.step, result.parentSequence)
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
		const canInsertStep = this.configuration.canInsertStep ? this.configuration.canInsertStep(step, targetSequence, targetIndex) : true;
		if (!canInsertStep) {
			return false;
		}

		SequenceModifier.insertStep(step, targetSequence, targetIndex);
		this.state.notifyDefinitionChanged(DefinitionChangeType.stepInserted, step.id);

		if (!this.configuration.isAutoSelectDisabled) {
			this.trySelectStepById(step.id);
		}
		return true;
	}

	public isDraggable(step: Step, parentSequence: Sequence): boolean {
		return this.configuration.isDraggable ? this.configuration.isDraggable(step, parentSequence) : true;
	}

	public tryMove(sourceSequence: Sequence, step: Step, targetSequence: Sequence, targetIndex: number): boolean {
		const apply = SequenceModifier.tryMoveStep(sourceSequence, step, targetSequence, targetIndex);
		if (!apply) {
			return false;
		}

		const canMoveStep = this.configuration.canMoveStep
			? this.configuration.canMoveStep(sourceSequence, step, targetSequence, targetIndex)
			: true;
		if (!canMoveStep) {
			return false;
		}

		apply();
		this.state.notifyDefinitionChanged(DefinitionChangeType.stepMoved, step.id);

		if (!this.configuration.isAutoSelectDisabled) {
			this.trySelectStep(step, targetSequence);
		}
		return true;
	}

	public isDuplicable(step: Step, parentSequence: Sequence): boolean {
		return this.configuration.isDuplicable ? this.configuration.isDuplicable(step, parentSequence) : false;
	}

	public tryDuplicate(step: Step, parentSequence: Sequence): boolean {
		const duplicator = new StepDuplicator(this.uidGenerator, this.definitionWalker);

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
