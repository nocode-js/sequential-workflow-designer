import { SimpleEvent } from './simple-event';

describe('SimpleEvent', () => {
	it('forward() works as expected', () => {
		const e = new SimpleEvent<void>();

		let counter = 0;
		function listener() {
			counter++;
		}

		e.subscribe(listener);
		e.forward();

		expect(counter).toEqual(1);
		expect(e.count()).toEqual(1);

		e.unsubscribe(listener);
		e.forward();

		expect(counter).toEqual(1);
		expect(e.count()).toEqual(0);
	});

	it('first() works as expected', done => {
		const e = new SimpleEvent<number>();
		let lastValue: number | undefined;

		e.first().then(v => (lastValue = v));

		e.forward(1);
		e.forward(2);
		e.forward(3);
		e.forward(4);

		setTimeout(() => {
			expect(lastValue).toEqual(1);
			done();
		}, 10);
	});
});
