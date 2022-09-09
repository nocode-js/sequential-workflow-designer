import { ComponentType, ContainerStep, Definition, Sequence, Step, SwitchStep } from '../definition';

function find(sequence: Sequence, needle: Sequence | Step, result: StepOrName[]): boolean {
	for (const step of sequence) {
		switch (step.componentType) {
			case ComponentType.task:
				if (step === needle) {
					return true;
				}
				break;
			case ComponentType.switch:
				{
					if (step === needle) {
						result.push(step);
						return true;
					}
					const switchStep = step as SwitchStep;
					const branchNames = Object.keys(switchStep.branches);
					for (const branchName of branchNames) {
						const branch = switchStep.branches[branchName];
						if (branch === needle || find(branch, needle, result)) {
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
					if (containerStep.sequence === needle || find(containerStep.sequence, needle, result)) {
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

export class StepsTranverser {
	public static getParents(definition: Definition, needle: Sequence | Step): StepOrName[] {
		const result: StepOrName[] = [];
		find(definition.sequence, needle, result);
		result.reverse();
		return result;
	}
}
