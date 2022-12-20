import { Dom } from '../../core/dom';
import { createComponentContextStub, createStepStub } from '../../test-tools/stubs';
import { SequenceComponent } from './sequence-component';

describe('SequenceComponent', () => {
	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const context = createComponentContextStub();
		const component = SequenceComponent.create(parent, [createStepStub()], context);

		expect(component).toBeDefined();
	});
});
