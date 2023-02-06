import { NextQuantifiedNumber } from './next-quantified-number';

describe('NextQuantifiedNumber', () => {
	const nqn = new NextQuantifiedNumber([0, 0.5, 1]);

	it('returns next', () => {
		const a = nqn.next(0, true);
		expect(a.current).toBe(0);
		expect(a.next).toBe(0.5);

		const b = nqn.next(0.2, true);
		expect(b.current).toBe(0);
		expect(b.next).toBe(0.5);

		const c = nqn.next(0.5, false);
		expect(c.current).toBe(0.5);
		expect(c.next).toBe(0);

		const d = nqn.next(0.26, false);
		expect(d.current).toBe(0.5);
		expect(d.next).toBe(0);

		const e = nqn.next(0.24, true);
		expect(e.current).toBe(0);
		expect(e.next).toBe(0.5);
	});
});
