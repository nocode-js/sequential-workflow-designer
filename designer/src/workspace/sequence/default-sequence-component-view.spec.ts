import { Dom } from '../../core/dom';
import { SequenceContext } from '../../designer-extension';
import { createComponentContextStub } from '../../test-tools/stubs';
import { DefaultSequenceComponentView } from './default-sequence-component-view';

describe('DefaultSequenceComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		const sequenceContext: SequenceContext = {
			depth: 0,
			isInputConnected: true,
			isOutputConnected: true,
			sequence: []
		};
		const componentContext = createComponentContextStub();
		DefaultSequenceComponentView.create(parent, sequenceContext, componentContext);
		expect(parent.children.length).not.toEqual(0);
	});
});
