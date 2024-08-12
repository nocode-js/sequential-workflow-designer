import { SimpleEvent } from './simple-event';

export function race<A, B, C, D>(
	timeout: number,
	a: SimpleEvent<A>,
	b: SimpleEvent<B>,
	c?: SimpleEvent<C>,
	d?: SimpleEvent<D>
): SimpleEvent<[A?, B?, C?, D?]> {
	const value: [A?, B?, C?, D?] = [undefined, undefined, undefined, undefined];
	const result = new SimpleEvent<[A?, B?, C?, D?]>();
	let scheduled = false;

	function forward() {
		if (scheduled) {
			return;
		}
		scheduled = true;
		setTimeout(() => {
			try {
				result.forward(value);
			} finally {
				scheduled = false;
				value.fill(undefined);
			}
		}, timeout);
	}

	function subscribe<T extends A | B | C | D>(event: SimpleEvent<T>, index: number) {
		event.subscribe(v => {
			value[index] = v;
			forward();
		});
	}

	subscribe(a, 0);
	subscribe(b, 1);
	if (c) {
		subscribe(c, 2);
	}
	if (d) {
		subscribe(d, 3);
	}
	return result;
}
