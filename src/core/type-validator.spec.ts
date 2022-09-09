import { TypeValidator } from './type-validator';

describe('TypeValidator', () => {
	it('passes', () => {
		TypeValidator.validate('test');
		TypeValidator.validate('z1');
		TypeValidator.validate('z-a-z');
		TypeValidator.validate('X-1-z');
		TypeValidator.validate('fooBar');
		TypeValidator.validate('a_b_c');
		TypeValidator.validate('test-x');
	});

	it('throws an error', () => {
		function test(type: string) {
			expect(() => TypeValidator.validate(type)).toThrowError(/contains not allowed characters/);
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
