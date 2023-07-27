import { DefinitionWalker, Step } from '../definition';
import { UidGenerator } from '../designer-configuration';
import { ObjectCloner } from './object-cloner';

export class StepDuplicator {
	public constructor(private readonly uidGenerator: UidGenerator, private readonly definitionWalker: DefinitionWalker) {}

	public duplicate(step: Step): Step {
		const newStep = ObjectCloner.deepClone(step);
		newStep.id = this.uidGenerator();

		this.definitionWalker.forEachChildren(newStep, s => {
			s.id = this.uidGenerator();
		});
		return newStep;
	}
}
