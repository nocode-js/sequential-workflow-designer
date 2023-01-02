import { Dom } from '../core/dom';
import { PathBarView } from './path-bar-view';

describe('PathBarView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');

		const pathBar = PathBarView.create(parent);

		expect(pathBar).toBeDefined();
	});
});
