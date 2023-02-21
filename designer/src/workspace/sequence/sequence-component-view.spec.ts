import { Dom } from '../../core/dom';
import { createComponentContextStub } from '../../test-tools/stubs';
import { SequenceContext } from './sequence-context';
import { SequenceComponentView } from './sequence-component-view';

describe('SequenceComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		const sequenceContext: SequenceContext = {
			depth: 0,
			isInputConnected: true,
			isOutputConnected: true,
			sequence: []
		};
		const componentContext = createComponentContextStub();
		SequenceComponentView.create(parent, sequenceContext, componentContext);
		expect(parent.children.length).not.toEqual(0);
	});
});
