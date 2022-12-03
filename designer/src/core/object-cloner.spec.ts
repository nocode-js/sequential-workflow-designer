import { ObjectCloner } from './object-cloner';

interface Foo {
	a: { b: number };
}

describe('ObjectCloner', () => {
	let i: Foo;

	beforeEach(() => {
		i = { a: { b: 12345 } };
	});

	function expectAll(j: Foo) {
		expect(j).toBeDefined();
		expect(Object.is(i, j)).toBeFalse();
		expect(Object.is(i.a, j.a)).toBeFalse();
		expect(j.a.b).toEqual(12345);
	}

	it('deepClone() clones the instance of an object', () => {
		const j = ObjectCloner.deepClone(i);
		expectAll(j);
	});

	it('deepClone() clones the instance of an object even if structuredClone() is not supported', () => {
		const orig = window.structuredClone;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		window.structuredClone = undefined as any;

		const parseSpy = spyOn(JSON, 'parse').and.callThrough();
		const stringifySpy = spyOn(JSON, 'stringify').and.callThrough();

		const j = ObjectCloner.deepClone(i);

		expect(orig).toBeDefined();
		expect(parseSpy.calls.count()).toEqual(1);
		expect(stringifySpy.calls.count()).toEqual(1);

		expectAll(j);

		window.structuredClone = orig;
	});
});
