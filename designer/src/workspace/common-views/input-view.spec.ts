import { Dom } from '../../core/dom';
import { InputView } from './input-view';

describe('InputView', () => {
	let parent: SVGElement;

	beforeEach(() => {
		parent = Dom.svg('svg');
	});

	it('createRectInput() creates view', () => {
		const view = InputView.createRectInput(parent, 10, 10, 16, 20, null);
		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});

	it('createRoundInput() creates view', () => {
		const view = InputView.createRoundInput(parent, 10, 10, 10);
		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
