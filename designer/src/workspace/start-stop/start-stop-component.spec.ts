import { Dom } from '../../core/dom';
import { createComponentContextStub } from '../../test-tools/stubs';
import { StartStopComponent } from './start-stop-component';

describe('StartStopComponent', () => {
	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const context = createComponentContextStub();
		const component = StartStopComponent.create(parent, [], null, context);

		expect(component).toBeDefined();
	});
});
