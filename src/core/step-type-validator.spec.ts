import { StepTypeValidator } from './step-type-validator';

describe('StepTypeValidator', () => {
	it('passes', () => {
		StepTypeValidator.validate('test');
		StepTypeValidator.validate('z1');
		StepTypeValidator.validate('z-a-z');
		StepTypeValidator.validate('X-1-z');
		StepTypeValidator.validate('fooBar');
		StepTypeValidator.validate('a_b_c');
		StepTypeValidator.validate('test-x');
	});

	it('throws an error', () => {
		function test(type: string) {
			expect(() => StepTypeValidator.validate(type)).toThrowError(/contains not allowed characters/);
		}

		test('0');
		test('x ');
		test('xx ');
		test(' ');
		test('');
		test('-');
		test('-');
		test('_test');
		test('-test');
		test('a_$');
		test('a_#');
	});
});
