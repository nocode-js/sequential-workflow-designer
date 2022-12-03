import { SimpleEvent } from './simple-event';
import { race } from './simple-event-race';

describe('race', () => {
	let a: SimpleEvent<number>;
	let b: SimpleEvent<number>;

	beforeEach(() => {
		a = new SimpleEvent<number>();
		b = new SimpleEvent<number>();
	});

	it('joins two events', done => {
		race(0, a, b).subscribe(r => {
			expect(r[0]).toEqual(0x128);
			expect(r[1]).toEqual(0x256);
			done();
		});

		a.forward(0x128);
		b.forward(0x256);
	});

	it('forwards first event only', done => {
		race(0, a, b).subscribe(r => {
			expect(r[0]).toEqual(0x128);
			expect(r[1]).toBeUndefined();
			done();
		});

		a.forward(0x128);
	});

	it('forwards second event only', done => {
		race(0, a, b).subscribe(r => {
			expect(r[0]).toBeUndefined();
			expect(r[1]).toEqual(0x256);
			done();
		});

		b.forward(0x256);
	});
});
