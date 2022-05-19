import { Vector } from './vector';

describe('Vector', () => {

	const A = new Vector(2, 10);

	it('add() returns proper value', () => {
		const r = A.add(new Vector(2, 1));
		expect(r.x).toEqual(4);
		expect(r.y).toEqual(11);
	});

	it('subtract() returns proper value', () => {
		const r = A.subtract(new Vector(2, 1));
		expect(r.x).toEqual(0);
		expect(r.y).toEqual(9);
	});

	it('round() returns proper value', () => {
		const d = new Vector(1.6, 1.3).round();
		expect(d.x).toEqual(2);
		expect(d.y).toEqual(1);
	});
});
