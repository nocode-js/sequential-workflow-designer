import { Icons } from '../../core';
import { Dom } from '../../core/dom';
import { createComponentContextStub } from '../../test-tools/stubs';
import { StartStopRootComponentView } from './start-stop-root-component-view';

describe('StartStopRootComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		const componentContext = createComponentContextStub();
		StartStopRootComponentView.create(parent, [], null, componentContext, {
			size: 30,
			defaultIconSize: 22,
			folderIconSize: 22,
			folderIconD: Icons.folder,
			startIconD: Icons.play,
			stopIconD: Icons.stop
		});
		expect(parent.children.length).not.toEqual(0);
	});
});
