import { Definition, Sequence, Step } from '../definition';
import { StepChildrenType } from '../designer-configuration';
import { StepExtensionDictionary } from '../workspace/component-context';

export type StepOrName = Step | string;

export class StepsTraverser {
	public constructor(private readonly stepExtensions: StepExtensionDictionary) {}

	private find(sequence: Sequence, needSequence: Sequence | null, needStepId: string | null, result: StepOrName[]): boolean {
		for (const step of sequence) {
			if (needStepId && step.id === needStepId) {
				result.push(step);
				return true;
			}

			const extension = this.stepExtensions[step.componentType];
			if (!extension) {
				throw new Error(`Not supported type: ${step.componentType}`);
			}

			const children = extension.getChildren(step);
			if (children) {
				switch (children.type) {
					case StepChildrenType.singleSequence:
						{
							const sequence = children.sequences as Sequence;
							if (
								(needStepId && step.id === needStepId) ||
								(needSequence && sequence === needSequence) ||
								this.find(sequence, needSequence, needStepId, result)
							) {
								result.push(step);
								return true;
							}
						}
						break;

					case StepChildrenType.branches:
						{
							const sequences = children.sequences as Record<string, Sequence>;
							const branchNames = Object.keys(sequences);
							for (const branchName of branchNames) {
								const branch = sequences[branchName];
								if ((needSequence && branch === needSequence) || this.find(branch, needSequence, needStepId, result)) {
									result.push(branchName);
									result.push(step);
									return true;
								}
							}
						}
						break;

					default:
						throw new Error(`Step children type ${children.type} is not supported`);
				}
			}
		}
		return false;
	}

	public getParents(definition: Definition, needle: Sequence | Step): StepOrName[] {
		const result: StepOrName[] = [];
		const searchSequence = Array.isArray(needle) ? needle : null;
		const searchStepId = !searchSequence ? (needle as Step).id : null;
		if (this.find(definition.sequence, searchSequence, searchStepId, result)) {
			result.reverse();
		}
		return result;
	}

	public findById(definition: Definition, stepId: string): Step | null {
		const result: StepOrName[] = [];
		if (this.find(definition.sequence, null, stepId, result)) {
			return result[0] as Step;
		}
		return null;
	}
}
