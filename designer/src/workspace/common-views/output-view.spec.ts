import { Dom } from '../../core/dom';
import { OutputView } from './output-view';

describe('OutputView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		OutputView.create(parent, 0, 0, 20);
		expect(parent.children.length).not.toEqual(0);
	});
});
