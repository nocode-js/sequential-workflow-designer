import { Dom } from '../../core/dom';
import { SequenceContext } from '../../designer-extension';
import { createComponentContextStub, createStepStub } from '../../test-tools/stubs';
import { DefaultSequenceComponent } from './default-sequence-component';

describe('DefaultSequenceComponent', () => {
	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const sequenceContext: SequenceContext = {
			depth: 0,
			isInputConnected: true,
			isOutputConnected: false,
			sequence: [createStepStub()]
		};
		const componentContext = createComponentContextStub();
		const component = DefaultSequenceComponent.create(parent, sequenceContext, componentContext);

		expect(component).toBeDefined();
	});
});
