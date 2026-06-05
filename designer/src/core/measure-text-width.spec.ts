import { Dom } from './dom';
import { measureTextWidth } from './measure-text-width';

describe('measureTextWidth', () => {
	it('returns positive width for visible text', () => {
		const svg = Dom.svg('svg');
		const text = Dom.svg('text');
		text.textContent = 'test';
		svg.appendChild(text);
		document.body.appendChild(svg);

		try {
			expect(measureTextWidth(text)).toBeGreaterThan(0);
		} finally {
			document.body.removeChild(svg);
		}
	});
});
