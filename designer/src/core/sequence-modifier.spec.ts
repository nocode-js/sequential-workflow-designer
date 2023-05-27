import { Sequence, Step } from '../definition';
import { SequenceModifier } from './sequence-modifier';

describe('SequenceModifier', () => {
	const A: Step = {
		id: '0x1',
		name: 'A',
		componentType: 'task',
		type: 'a',
		properties: {}
	};
	const B: Step = {
		id: '0x2',
		name: 'B',
		componentType: 'task',
		type: 'b',
		properties: {}
	};
	const C: Step = {
		id: '0x3',
		name: 'C',
		componentType: 'task',
		type: 'c',
		properties: {}
	};
	const D: Step = {
		id: '0x4',
		name: 'D',
		componentType: 'task',
		type: 'd',
		properties: {}
	};

	let seq: Sequence;

	beforeEach(() => {
		seq = [A, B, C];
	});

	describe('tryMoveStep()', () => {
		it('returns null when the change is for the same index', () => {
			const apply = SequenceModifier.tryMoveStep(seq, A, seq, 0) as () => void;

			expect(apply).toBeNull();
			expect(seq[0]).toEqual(A);
			expect(seq[1]).toEqual(B);
			expect(seq[2]).toEqual(C);
		});

		it('returns null when the change for the same index + 1', () => {
			const apply = SequenceModifier.tryMoveStep(seq, A, seq, 1) as () => void;

			expect(apply).toBeNull();
			expect(seq[0]).toEqual(A);
			expect(seq[1]).toEqual(B);
			expect(seq[2]).toEqual(C);
		});

		it('moves A node to 2nd position', () => {
			const apply = SequenceModifier.tryMoveStep(seq, A, seq, 2) as () => void;
			apply();

			expect(seq[0]).toEqual(B);
			expect(seq[1]).toEqual(A);
			expect(seq[2]).toEqual(C);
		});

		it('moves A node to 3rd position', () => {
			const apply = SequenceModifier.tryMoveStep(seq, A, seq, 3) as () => void;
			apply();

			expect(seq[0]).toEqual(B);
			expect(seq[1]).toEqual(C);
			expect(seq[2]).toEqual(A);
		});

		it('moves B node to first position', () => {
			const apply = SequenceModifier.tryMoveStep(seq, B, seq, 0) as () => void;
			apply();

			expect(seq[0]).toEqual(B);
			expect(seq[1]).toEqual(A);
			expect(seq[2]).toEqual(C);
		});

		it('moves B node to 3rd position', () => {
			const apply = SequenceModifier.tryMoveStep(seq, B, seq, 3) as () => void;
			apply();

			expect(seq[0]).toEqual(A);
			expect(seq[1]).toEqual(C);
			expect(seq[2]).toEqual(B);
		});
	});

	it('insertStep() adds at the beginning', () => {
		SequenceModifier.insertStep(D, seq, 0);

		expect(seq[0]).toEqual(D);
		expect(seq[1]).toEqual(A);
		expect(seq[2]).toEqual(B);
		expect(seq[3]).toEqual(C);
	});

	it('deleteStep() deletes a step', () => {
		SequenceModifier.deleteStep(B, seq);

		expect(seq.length).toEqual(2);
		expect(seq[0]).toEqual(A);
		expect(seq[1]).toEqual(C);
	});
});
