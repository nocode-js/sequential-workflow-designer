import { Vector } from '../../core';
import { CenteredViewportCalculator } from './centered-viewport-calculator';

describe('CenteredViewportCalculator', () => {
	describe('center()', () => {
		const c100x100 = new Vector(100, 100);

		it('root component fills 100% of canvas (margin = 0)', () => {
			const vp = CenteredViewportCalculator.center(0, c100x100, new Vector(100, 100));

			expect(vp.position.x).toBe(0);
			expect(vp.position.y).toBe(0);
			expect(vp.scale).toBe(1);
		});

		it('root component fills 100% of canvas (margin = 20)', () => {
			const vp = CenteredViewportCalculator.center(20, c100x100, new Vector(100, 100));

			expect(vp.position.x).toBe(20);
			expect(vp.position.y).toBe(20);
			expect(vp.scale).toBe(0.6);
		});

		it('root component is smaller than canvas (margin = 20)', () => {
			const vp = CenteredViewportCalculator.center(20, c100x100, new Vector(10, 20));

			expect(vp.position.x).toBe(45);
			expect(vp.position.y).toBe(40);
			expect(vp.scale).toBe(1);
		});

		it('root component is bigger than canvas (margin = 20)', () => {
			const vp = CenteredViewportCalculator.center(20, c100x100, new Vector(200, 200));

			expect(vp.position.x).toBe(20);
			expect(vp.position.y).toBe(20);
			expect(vp.scale).toBe(0.3);
		});
	});
});
