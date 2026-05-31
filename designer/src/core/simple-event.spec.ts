import { SimpleEvent } from './simple-event';

describe('SimpleEvent', () => {
	it('forward() works as expected', () => {
		const e = new SimpleEvent<void>();

		let counter = 0;
		function listener() {
			counter++;
		}

		e.subscribe(listener);
		e.emit();

		expect(counter).toEqual(1);
		expect(e.count()).toEqual(1);

		e.unsubscribe(listener);
		e.emit();

		expect(counter).toEqual(1);
		expect(e.count()).toEqual(0);
	});

	it('once() works as expected', done => {
		const e = new SimpleEvent<number>();
		let lastValue: number | undefined;

		e.once().then(v => (lastValue = v));

		e.emit(1);
		e.emit(2);
		e.emit(3);
		e.emit(4);

		setTimeout(() => {
			expect(lastValue).toEqual(1);
			done();
		}, 10);
	});
});
