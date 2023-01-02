import { SimpleEvent } from './simple-event';

export function race<A, B, C>(timeout: number, a: SimpleEvent<A>, b: SimpleEvent<B>, c?: SimpleEvent<C>): SimpleEvent<[A?, B?, C?]> {
	const value: [A?, B?, C?] = [undefined, undefined, undefined];
	const result = new SimpleEvent<[A?, B?, C?]>();
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

	[a, b, c]
		.filter(e => e)
		.forEach((e, index) => {
			(e as SimpleEvent<A | B | C>).subscribe(v => {
				value[index] = v;
				forward();
			});
		});
	return result;
}
