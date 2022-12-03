import { Dom } from '../../core/dom';
import { LabelView } from './label-view';

describe('LabelView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		LabelView.create(parent, 0, 0, 'test');
		expect(parent.children.length).not.toEqual(0);
	});
});
