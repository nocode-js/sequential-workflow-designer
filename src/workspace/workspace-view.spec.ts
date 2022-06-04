import { Dom } from '../core/dom';
import { WorkspaceView } from './workspace-view';

describe('WorkspaceView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');
		WorkspaceView.create(parent, {});
		expect(parent.children.length).not.toEqual(0);
	});
});
