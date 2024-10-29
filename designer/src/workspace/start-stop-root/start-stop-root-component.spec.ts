import { Icons } from '../../core';
import { Dom } from '../../core/dom';
import { createComponentContextStub } from '../../test-tools/stubs';
import { StartStopRootComponent } from './start-stop-root-component';

describe('StartStopRootComponent', () => {
	it('create() creates component', () => {
		const parent = Dom.svg('svg');
		const componentContext = createComponentContextStub();
		const component = StartStopRootComponent.create(parent, [], null, componentContext, {
			size: 30,
			defaultIconSize: 22,
			folderIconSize: 22,
			folderIconD: Icons.folder,
			startIconD: Icons.play,
			stopIconD: Icons.stop
		});

		expect(component).toBeDefined();
	});
});
