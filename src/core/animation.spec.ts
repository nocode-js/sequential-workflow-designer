import { animate } from './animation';

describe('animate()', () => {
	it('animate() animates correctly', done => {
		const interval = 200;
		const startTime = Date.now();
		let count = 0;
		let lastProgress = 0;

		animate(interval, progress => {
			count++;
			if (progress < lastProgress) {
				done.fail('Invalid progress');
			}
			lastProgress = progress;

			if (progress === 1) {
				const elapsed = Math.abs(Date.now() - startTime);
				if (count > 3 && elapsed > interval * 0.9) {
					done();
				} else {
					done.fail('Invalid amount of calls');
				}
			}
		});
	});
});
