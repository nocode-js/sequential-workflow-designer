import { Dom } from '../core/dom';
import { createDesignerApiStub } from '../test-tools/stubs';
import { ControlBar } from './control-bar';

describe('ControlBar', () => {
	it('create() creates bar', () => {
		const parent = Dom.element('div');
		const api = createDesignerApiStub();

		const bar = ControlBar.create(parent, api);

		expect(bar).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
