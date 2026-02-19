import { DefinitionWalker, Step } from '../definition';
import { DuplicatedStepId, UidGenerator } from '../designer-configuration';
import { ObjectCloner } from './object-cloner';

export interface StepDuplicatorResult {
	step: Step;
	duplicatedIds: DuplicatedStepId[];
}

export class StepDuplicator {
	public constructor(
		private readonly uidGenerator: UidGenerator,
		private readonly definitionWalker: DefinitionWalker
	) {}

	public duplicate(step: Step): StepDuplicatorResult {
		const newStep = ObjectCloner.deepClone(step);
		const duplicatedIds: DuplicatedStepId[] = [];

		const newId = this.uidGenerator();
		duplicatedIds.push([step.id, newId]);
		newStep.id = newId;

		this.definitionWalker.forEachChildren(newStep, s => {
			const newId = this.uidGenerator();
			duplicatedIds.push([s.id, newId]);
			s.id = newId;
		});
		return {
			step: newStep,
			duplicatedIds
		};
	}
}
