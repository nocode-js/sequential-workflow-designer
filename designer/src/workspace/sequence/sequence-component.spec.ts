import { Dom } from '../../core/dom';
import { createComponentContextStub, createStepStub } from '../../test-tools/stubs';
import { SequenceComponent } from './sequence-component';
import { SequenceContext } from './sequence-context';

describe('SequenceComponent', () => {
	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const sequenceContext: SequenceContext = {
			depth: 0,
			isInputConnected: true,
			isOutputConnected: false,
			sequence: [createStepStub()]
		};
		const componentContext = createComponentContextStub();
		const component = SequenceComponent.create(parent, sequenceContext, componentContext);

		expect(component).toBeDefined();
	});
});
