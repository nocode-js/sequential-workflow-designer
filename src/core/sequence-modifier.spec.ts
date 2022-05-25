import { Sequence, ComponentType, TaskStep } from "../definition";
import { SequenceModifier } from "./sequence-modifier";

describe('SequenceModifier', () => {

	const A: TaskStep = { id: '0x1', name: 'A', componentType: ComponentType.task, type: 'a', properties: {} };
	const B: TaskStep = { id: '0x2', name: 'B', componentType: ComponentType.task, type: 'b', properties: {} };
	const C: TaskStep = { id: '0x3', name: 'C', componentType: ComponentType.task, type: 'c', properties: {} };
	const D: TaskStep = { id: '0x4', name: 'D', componentType: ComponentType.task, type: 'd', properties: {} };

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
