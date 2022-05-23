import { Sequence, Step } from '../definition';

export class SequenceModifier {

	public static moveStep(sourceSequence: Sequence, step: Step, targetSequence: Sequence, targetIndex: number) {
		const sourceIndex = sourceSequence.steps.indexOf(step);
		if (sourceIndex < 0) {
			throw new Error('Unknown step');
		}

		const isSameSequence = sourceSequence === targetSequence;
		if (isSameSequence && sourceIndex === targetIndex) {
			return; // Nothing to do.
		}

		sourceSequence.steps.splice(sourceIndex, 1);
		if (isSameSequence && sourceIndex < targetIndex) {
			targetIndex--;
		}
		targetSequence.steps.splice(targetIndex, 0, step);
	}

	public static insertStep(step: Step, sequence: Sequence, index: number) {
		sequence.steps.splice(index, 0, step);
	}

	public static deleteStep(step: Step, sequence: Sequence) {
		const index = sequence.steps.indexOf(step);
		if (index < 0) {
			throw new Error('Unknown step');
		}
		sequence.steps.splice(index, 1);
	}
}
