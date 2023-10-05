import { BranchedStep, DefinitionWalker, SequentialStep, Step } from '../definition';
import { StepDuplicator } from './step-duplicator';
import { Uid } from './uid';

describe('StepDuplicator', () => {
	const saveStep: Step = {
		type: 'save',
		componentType: 'task',
		id: '0x0',
		name: 'Save',
		properties: {}
	};

	const loopStep: SequentialStep = {
		type: 'loop',
		componentType: 'container',
		id: '0x1',
		name: 'Loop',
		properties: {},
		sequence: [saveStep]
	};

	const ifStep: BranchedStep = {
		type: 'if',
		componentType: 'switch',
		id: '0x2',
		name: 'If',
		properties: {},
		branches: {
			true: [loopStep],
			false: []
		}
	};

	it('duplicates correctly', () => {
		const duplicator = new StepDuplicator(Uid.next, new DefinitionWalker());

		const duplicatedIf = duplicator.duplicate(ifStep) as BranchedStep;

		expect(duplicatedIf).not.toBe(ifStep);
		expect(duplicatedIf.id).not.toBe(ifStep.id);
		expect(duplicatedIf.type).toBe('if');

		const duplicatedLoop = duplicatedIf.branches.true[0] as SequentialStep;
		expect(duplicatedLoop).not.toBe(loopStep);
		expect(duplicatedLoop.id).not.toBe(loopStep.id);
		expect(duplicatedLoop.type).toBe('loop');

		const duplicatedSave = duplicatedLoop.sequence[0];
		expect(duplicatedSave).not.toBe(saveStep);
		expect(duplicatedSave.id).not.toBe(saveStep.id);
		expect(duplicatedSave.type).toBe('save');
	});
});
