import { Dom } from '../core/dom';
import { SequenceComponent } from './sequence-component';

describe('SequenceComponent', () => {

	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const component = SequenceComponent.create(parent, [], {});

		expect(component).toBeDefined();
	});
});
