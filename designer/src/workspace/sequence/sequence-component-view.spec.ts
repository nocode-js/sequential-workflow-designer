import { Dom } from '../../core/dom';
import { SequenceComponentView } from './sequence-component-view';

describe('SequenceComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		SequenceComponentView.create(parent, [], {});
		expect(parent.children.length).not.toEqual(0);
	});
});
