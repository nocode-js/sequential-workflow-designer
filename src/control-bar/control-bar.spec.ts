import { Dom } from '../core/dom';
import { createDesignerContextStub } from '../test-tools/stubs';
import { ControlBar } from './control-bar';

describe('ControlBar', () => {
	it('create() creates bar', () => {
		const parent = Dom.element('div');
		const context = createDesignerContextStub();

		const bar = ControlBar.create(parent, context);

		expect(bar).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
