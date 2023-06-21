import { Sequence } from '../definition';
import { DesignerState } from '../designer-state';
import { createStepStub } from '../test-tools/stubs';
import { createDefinitionStub } from '../test-tools/stubs';
import { DefinitionValidator } from './definition-validator';

describe('DefinitionValidator', () => {
	const testStep = createStepStub();
	const testSequence: Sequence = [];
	const testDefinition = createDefinitionStub();
	let state: DesignerState;

	beforeEach(() => {
		state = new DesignerState(testDefinition, false, false, false);
	});

	it('returns true if providers are not set in configuration', () => {
		const validator = new DefinitionValidator(undefined, state);

		expect(validator.validateRoot()).toBe(true);
		expect(validator.validateStep(testStep, testSequence)).toBe(true);
	});

	it('forwards value from provider', () => {
		let rootCalled = false;
		let stepCalled = false;

		const validator = new DefinitionValidator(
			{
				root: definition => {
					expect(definition).toBe(testDefinition);
					rootCalled = true;
					return false;
				},
				step: (step, sequence, definition) => {
					expect(definition).toBe(testDefinition);
					expect(step).toBe(testStep);
					expect(sequence).toBe(testSequence);
					stepCalled = true;
					return false;
				}
			},
			state
		);

		expect(validator.validateRoot()).toBe(false);
		expect(validator.validateStep(testStep, testSequence)).toBe(false);
		expect(rootCalled).toBe(true);
		expect(stepCalled).toBe(true);
	});
});
