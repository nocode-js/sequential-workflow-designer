import { Vector } from './vector';

describe('Vector', () => {
	const P = new Vector(2, 10);

	it('add() returns proper value', () => {
		const r = P.add(new Vector(2, 1));
		expect(r.x).toEqual(4);
		expect(r.y).toEqual(11);
	});

	it('subtract() returns proper value', () => {
		const r = P.subtract(new Vector(2, 1));
		expect(r.x).toEqual(0);
		expect(r.y).toEqual(9);
	});

	it('multiplyByScalar() returns proper value', () => {
		const r = P.multiplyByScalar(5);
		expect(r.x).toEqual(10);
		expect(r.y).toEqual(50);
	});

	it('divideByScalar() returns proper value', () => {
		const r = P.divideByScalar(2);
		expect(r.x).toEqual(1);
		expect(r.y).toEqual(5);
	});

	it('round() returns proper value', () => {
		const d = new Vector(1.6, 1.3).round();
		expect(d.x).toEqual(2);
		expect(d.y).toEqual(1);
	});

	it('distance() returns proper value', () => {
		const r = new Vector(2, 2).distance();
		expect(Math.abs(r - 2.82842)).toBeLessThan(0.0001);
	});
});
