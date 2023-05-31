import { createSwitchStep, createTaskStep } from './StepUtils';

describe('StepUtils', () => {
	it('createTaskStep() returns different ids', () => {
		const a = createTaskStep();
		const b = createTaskStep();

		expect(a.id).not.toBe(b.id);
	});

	it('createSwitchStep() returns different ids', () => {
		const a = createSwitchStep();
		const b = createSwitchStep();

		expect(a.id).not.toBe(b.id);
	});
});
