import { Dom } from '../../core/dom';
import { createComponentContextStub } from '../../test-tools/stubs';
import { StartStopComponentView } from './start-stop-component-view';

describe('StartStopComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		const context = createComponentContextStub();
		StartStopComponentView.create(parent, [], context);
		expect(parent.children.length).not.toEqual(0);
	});
});
