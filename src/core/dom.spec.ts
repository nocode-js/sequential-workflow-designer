import { Dom } from './dom';

describe('Dom', () => {
	it('svg() creates SVG element', () => {
		const s = Dom.svg('svg', {
			class: 'foo bar'
		});
		expect(s.tagName.toLowerCase()).toEqual('svg');
		expect(s.classList.contains('foo')).toBeTrue();
		expect(s.classList.contains('bar')).toBeTrue();
		expect(s.namespaceURI).toEqual('http://www.w3.org/2000/svg');
	});

	it('element() creates HTML element', () => {
		const s = Dom.element('input', {
			type: 'text'
		});
		expect(s.tagName.toLowerCase()).toEqual('input');
		expect(s.getAttribute('type')).toEqual('text');
	});

	it('toggleClass() turns on/off class name', () => {
		const e = Dom.element('div');

		expect(e.classList.contains('a')).toBeFalse();

		Dom.toggleClass(e, true, 'a');

		expect(e.classList.contains('a')).toBeTrue();

		Dom.toggleClass(e, false, 'a');

		expect(e.classList.contains('a')).toBeFalse();
	});
});
