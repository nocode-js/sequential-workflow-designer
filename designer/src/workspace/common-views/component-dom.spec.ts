import { ComponentDom } from './component-dom';

describe('ComponentDom', () => {
	it('stepG() creates <g> element', () => {
		const view = ComponentDom.stepG('container', 'foreach', 'some-id');

		expect(view.tagName.toLowerCase()).toBe('g');
		expect(view.getAttribute('class')).toBe('sqd-step-container sqd-type-foreach');
		expect(view.getAttribute('data-step-id')).toBe('some-id');
	});
});
