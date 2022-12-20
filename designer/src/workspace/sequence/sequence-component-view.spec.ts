import { Dom } from '../../core/dom';
import { createComponentContextStub } from '../../test-tools/stubs';
import { SequenceComponentView } from './sequence-component-view';

describe('SequenceComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		const context = createComponentContextStub();
		SequenceComponentView.create(parent, [], context);
		expect(parent.children.length).not.toEqual(0);
	});
});
