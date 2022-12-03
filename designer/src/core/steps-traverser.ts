import { ComponentType, ContainerStep, Definition, Sequence, Step, SwitchStep } from '../definition';

function find(sequence: Sequence, needSequence: Sequence | null, needStepId: string | null, result: StepOrName[]): boolean {
	for (const step of sequence) {
		switch (step.componentType) {
			case ComponentType.task:
				if (needStepId && step.id === needStepId) {
					result.push(step);
					return true;
				}
				break;
			case ComponentType.switch:
				{
					if (needStepId && step.id === needStepId) {
						result.push(step);
						return true;
					}
					const switchStep = step as SwitchStep;
					const branchNames = Object.keys(switchStep.branches);
					for (const branchName of branchNames) {
						const branch = switchStep.branches[branchName];
						if ((needSequence && branch === needSequence) || find(branch, needSequence, needStepId, result)) {
							result.push(branchName);
							result.push(step);
							return true;
						}
					}
				}
				break;
			case ComponentType.container:
				{
					const containerStep = step as ContainerStep;
					if (
						(needStepId && step.id === needStepId) ||
						(needSequence && containerStep.sequence === needSequence) ||
						find(containerStep.sequence, needSequence, needStepId, result)
					) {
						result.push(step);
						return true;
					}
				}
				break;
			default:
				throw new Error(`Not supported type: ${step.componentType}`);
		}
	}
	return false;
}

export type StepOrName = Step | string;

export class StepsTraverser {
	public static getParents(definition: Definition, needle: Sequence | Step): StepOrName[] {
		const result: StepOrName[] = [];
		const searchSequence = Array.isArray(needle) ? needle : null;
		const searchStepId = !searchSequence ? (needle as Step).id : null;
		if (find(definition.sequence, searchSequence, searchStepId, result)) {
			result.reverse();
		}
		return result;
	}

	public static findById(definition: Definition, stepId: string): Step | null {
		const result: StepOrName[] = [];
		if (find(definition.sequence, null, stepId, result)) {
			return result[0] as Step;
		}
		return null;
	}
}
