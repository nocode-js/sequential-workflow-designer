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
});
