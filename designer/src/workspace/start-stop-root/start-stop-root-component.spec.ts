import { Dom } from '../../core/dom';
import { createComponentContextStub } from '../../test-tools/stubs';
import { StartStopRootComponent } from './start-stop-root-component';

describe('StartStopRootComponent', () => {
	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const componentContext = createComponentContextStub();
		const component = StartStopRootComponent.create(parent, [], null, componentContext);

		expect(component).toBeDefined();
	});
});
