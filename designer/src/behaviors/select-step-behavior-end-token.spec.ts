import { BehaviorEndToken } from './behavior';
import { SelectStepBehaviorEndToken } from './select-step-behavior-end-token';

describe('SelectStepBehaviorEndToken', () => {
	it('can detect own type', () => {
		const endToken = new SelectStepBehaviorEndToken('0', 0);

		expect(SelectStepBehaviorEndToken.is(endToken)).toBe(true);

		expect(SelectStepBehaviorEndToken.is({ type: 'test' })).toBe(false);

		expect(SelectStepBehaviorEndToken.is(null)).toBe(false);

		expect(SelectStepBehaviorEndToken.is(undefined as unknown as BehaviorEndToken)).toBe(false);
	});
});
