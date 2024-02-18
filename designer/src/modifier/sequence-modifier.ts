import { Sequence, Step } from '../definition';

export class SequenceModifier {
	public static tryMoveStep(sourceSequence: Sequence, step: Step, targetSequence: Sequence, targetIndex: number): (() => void) | null {
		const sourceIndex = sourceSequence.indexOf(step);
		if (sourceIndex < 0) {
			throw new Error('Step not found in source sequence');
		}

		const isSameSequence = sourceSequence === targetSequence;
		if (isSameSequence) {
			if (sourceIndex < targetIndex) {
				targetIndex--;
			}
			if (sourceIndex === targetIndex) {
				return null; // No changes
			}
		}

		return function apply() {
			sourceSequence.splice(sourceIndex, 1);
			targetSequence.splice(targetIndex, 0, step);
		};
	}

	public static insertStep(step: Step, targetSequence: Sequence, targetIndex: number) {
		targetSequence.splice(targetIndex, 0, step);
	}

	public static deleteStep(step: Step, parentSequence: Sequence) {
		const index = parentSequence.indexOf(step);
		if (index < 0) {
			throw new Error('Unknown step');
		}
		parentSequence.splice(index, 1);
	}
}
