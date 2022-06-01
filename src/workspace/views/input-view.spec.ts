import { Dom } from '../../core/dom';
import { InputView } from './input-view';

describe('InputView', () => {

	let parent: SVGElement;

	beforeEach(() => {
		parent = Dom.svg('svg');
	});

	it('createRectInput() creates view', () => {
		const component = InputView.createRectInput(parent, 10, 10, null);
		expect(component).toBeDefined();
	});

	it('createRoundInput() creates view', () => {
		const component = InputView.createRoundInput(parent, 10, 10);
		expect(component).toBeDefined();
	});
});
