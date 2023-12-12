import { getAbsolutePosition } from './get-absolute-position';

describe('getAbsolutePosition', () => {
	it('returns correct position', () => {
		const el = document.createElement('div');
		el.style.position = 'absolute';
		el.style.left = '10px';
		el.style.top = '20px';

		document.body.appendChild(el);

		const position = getAbsolutePosition(el);

		expect(position.x).toBe(10);
		expect(position.y).toBe(20);

		document.body.removeChild(el);
	});
});
