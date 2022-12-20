import { Dom } from '../core/dom';
import { createComponentContextStub } from '../test-tools/stubs';
import { WorkspaceView } from './workspace-view';

describe('WorkspaceView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');
		const componentContext = createComponentContextStub();
		WorkspaceView.create(parent, componentContext);
		expect(parent.children.length).not.toEqual(0);
	});
});
