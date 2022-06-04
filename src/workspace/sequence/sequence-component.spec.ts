import { Dom } from '../../core/dom';
import { createStepStub } from '../../test-tools/stubs';
import { SequenceComponent } from './sequence-component';

describe('SequenceComponent', () => {

	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const component = SequenceComponent.create(parent, [
			createStepStub()
		], {});

		expect(component).toBeDefined();
	});
});
