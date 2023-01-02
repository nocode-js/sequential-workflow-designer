import { Branches, Definition, Sequence, Step } from '../definition';
import { StepChildrenType, StepChildren } from '../designer-configuration';
import { StepExtensionDictionary } from '../workspace/component-context';

export interface StepWithParentSequence {
	step: Step;
	/**
	 * Index of the step in the parent sequence.
	 */
	index: number;
	parentSequence: Sequence;
}

type StepWithParentSequenceOrName = StepWithParentSequence | string;

export type StepOrName = Step | string;

export interface StepWithParentAndChildSequences {
	index: number;
	parentSequence: Sequence;
	childSequence: Sequence;
}

export class StepsTraverser {
	public constructor(private readonly stepExtensions: StepExtensionDictionary) {}

	private getChildren(step: Step): StepChildren | null {
		const extension = this.stepExtensions[step.componentType];
		if (!extension) {
			throw new Error(`Not supported component type: ${step.componentType}`);
		}
		return extension.getChildren(step);
	}

	private find(
		sequence: Sequence,
		needSequence: Sequence | null,
		needStepId: string | null,
		result: StepWithParentSequenceOrName[]
	): boolean {
		if (needSequence && sequence === needSequence) {
			return true;
		}
		const count = sequence.length;
		for (let index = 0; index < count; index++) {
			const step = sequence[index];
			if (needStepId && step.id === needStepId) {
				result.push({ step, index, parentSequence: sequence });
				return true;
			}

			const children = this.getChildren(step);
			if (children) {
				switch (children.type) {
					case StepChildrenType.singleSequence:
						{
							const parentSequence = children.sequences as Sequence;
							if (this.find(parentSequence, needSequence, needStepId, result)) {
								result.push({ step, index, parentSequence });
								return true;
							}
						}
						break;

					case StepChildrenType.branches:
						{
							const branches = children.sequences as Branches;
							const branchNames = Object.keys(branches);
							for (const branchName of branchNames) {
								const parentSequence = branches[branchName];
								if (this.find(parentSequence, needSequence, needStepId, result)) {
									result.push(branchName);
									result.push({ step, index, parentSequence });
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
		const result: StepWithParentSequenceOrName[] = [];
		const searchSequence = Array.isArray(needle) ? needle : null;
		const searchStepId = !searchSequence ? (needle as Step).id : null;

		if (this.find(definition.sequence, searchSequence, searchStepId, result)) {
			result.reverse();
			return result.map(item => {
				return typeof item === 'string' ? item : item.step;
			});
		}

		throw new Error(searchStepId ? `Cannot get parents of step: ${searchStepId}` : 'Cannot get parents of sequence');
	}

	public findParentSequence(definition: Definition, stepId: string): StepWithParentSequence | null {
		const result: StepWithParentSequenceOrName[] = [];
		if (this.find(definition.sequence, null, stepId, result)) {
			return result[0] as StepWithParentSequence;
		}
		return null;
	}

	public getParentSequence(definition: Definition, stepId: string): StepWithParentSequence {
		const result = this.findParentSequence(definition, stepId);
		if (!result) {
			throw new Error(`Cannot find step by id: ${stepId}`);
		}
		return result;
	}

	public findById(definition: Definition, stepId: string): Step | null {
		const result = this.findParentSequence(definition, stepId);
		return result ? result.step : null;
	}

	public getById(definition: Definition, stepId: string): Step {
		return this.getParentSequence(definition, stepId).step;
	}

	public getChildAndParentSequences(definition: Definition, stepId: string): StepWithParentAndChildSequences {
		const result = this.getParentSequence(definition, stepId);

		const lastStepChildren = this.getChildren(result.step);
		if (!lastStepChildren || lastStepChildren.type !== StepChildrenType.singleSequence) {
			throw new Error(`Cannot find single sequence in step: ${stepId}`);
		}
		const childSequence = lastStepChildren.sequences as Sequence;

		return { index: result.index, parentSequence: result.parentSequence, childSequence };
	}
}
