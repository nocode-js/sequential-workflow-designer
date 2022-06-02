import { ObjectCloner } from './object-cloner';

describe('ObjectCloner', () => {

	it('deepClone() clones the instance of an object', () => {
		const i = { a: { b: 12345 } };

		const j = ObjectCloner.deepClone(i);

		expect(Object.is(i, j)).toBeFalse();
		expect(Object.is(i.a, j.a)).toBeFalse();
		expect(j.a.b).toEqual(12345);
	});
});
