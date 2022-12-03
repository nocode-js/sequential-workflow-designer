import { SimpleEvent } from './simple-event';

export function race<A, B>(timeout: number, a: SimpleEvent<A>, b: SimpleEvent<B>): SimpleEvent<[A?, B?]> {
	const value: [A?, B?] = [undefined, undefined];
	const result = new SimpleEvent<[A?, B?]>();
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

	[a, b]
		.filter(e => e)
		.forEach((e, index) => {
			e.subscribe(v => {
				value[index] = v;
				forward();
			});
		});
	return result;
}
