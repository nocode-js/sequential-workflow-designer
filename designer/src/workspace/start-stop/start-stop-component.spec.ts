import { Dom } from '../../core/dom';
import { StartStopComponent } from './start-stop-component';

describe('StartStopComponent', () => {
	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const component = StartStopComponent.create(parent, [], {});

		expect(component).toBeDefined();
	});
});
