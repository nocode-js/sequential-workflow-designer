import { Sequence, StepType, TaskStep } from "../definition";
import { SequenceModifier } from "./sequence-modifier";

describe('SequenceModifier', () => {

	const A: TaskStep = { name: 'A', type: StepType.task, internalType: 'a' };
	const B: TaskStep = { name: 'B', type: StepType.task, internalType: 'b' };
	const C: TaskStep = { name: 'C', type: StepType.task, internalType: 'c' };
	const D: TaskStep = { name: 'D', type: StepType.task, internalType: 'd' };

	function flatABC(): Sequence {
		return {
			steps: [
				A,
				B,
				C
			]
		};
	}

	it('moveStep() does nothing when the change is for the same index', () => {
		const seq = flatABC();
		SequenceModifier.moveStep(seq, A, seq, 0);

		expect(seq.steps[0]).toEqual(A);
		expect(seq.steps[1]).toEqual(B);
		expect(seq.steps[2]).toEqual(C);
	});

	it('moveStep() moves the first node to the last positon', () => {
		const seq = flatABC();
		SequenceModifier.moveStep(seq, A, seq, 3);

		expect(seq.steps[0]).toEqual(B);
		expect(seq.steps[1]).toEqual(C);
		expect(seq.steps[2]).toEqual(A);
	});

	it('moveStep() moves the first node to one before the last position', () => {
		const seq = flatABC();
		SequenceModifier.moveStep(seq, A, seq, 2);

		expect(seq.steps[0]).toEqual(B);
		expect(seq.steps[1]).toEqual(A);
		expect(seq.steps[2]).toEqual(C);
	});

	it('insertStep() adds at the beginning', () => {
		const seq = flatABC();
		SequenceModifier.insertStep(D, seq, 0);

		expect(seq.steps[0]).toEqual(D);
		expect(seq.steps[1]).toEqual(A);
		expect(seq.steps[2]).toEqual(B);
		expect(seq.steps[3]).toEqual(C);
	});

	it('deleteStep() deletes a step', () => {
		const seq = flatABC();
		SequenceModifier.deleteStep(B, seq);

		expect(seq.steps.length).toEqual(2);
		expect(seq.steps[0]).toEqual(A);
		expect(seq.steps[1]).toEqual(C);
	});
});
