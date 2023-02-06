import { isElementAttached } from './is-element-attached';

describe('isElementAttached', () => {
	it('returns true if attached', () => {
		const element = document.createElement('h2');

		document.body.appendChild(element);

		expect(isElementAttached(element)).toBe(true);

		document.body.removeChild(element);
	});

	it('returns false if not attached', () => {
		const element = document.createElement('h2');

		expect(isElementAttached(element)).toBe(false);
	});
});
