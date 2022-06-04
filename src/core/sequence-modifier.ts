import { Sequence, Step } from '../definition';

export class SequenceModifier {
	public static moveStep(sourceSequence: Sequence, step: Step, targetSequence: Sequence, targetIndex: number) {
		const sourceIndex = sourceSequence.indexOf(step);
		if (sourceIndex < 0) {
			throw new Error('Unknown step');
		}

		const isSameSequence = sourceSequence === targetSequence;
		if (isSameSequence && sourceIndex === targetIndex) {
			return; // Nothing to do.
		}

		sourceSequence.splice(sourceIndex, 1);
		if (isSameSequence && sourceIndex < targetIndex) {
			targetIndex--;
		}
		targetSequence.splice(targetIndex, 0, step);
	}

	public static insertStep(step: Step, sequence: Sequence, index: number) {
		sequence.splice(index, 0, step);
	}

	public static deleteStep(step: Step, sequence: Sequence) {
		const index = sequence.indexOf(step);
		if (index < 0) {
			throw new Error('Unknown step');
		}
		sequence.splice(index, 1);
	}
}
