import { Dom } from '../core/dom';
import { createDesignerContextStub } from '../test-tools/stubs';
import { PathBar } from './path-bar';

describe('PathBar', () => {
	it('create() creates bar', () => {
		const parent = Dom.element('div');
		const context = createDesignerContextStub();

		const pathBar = PathBar.create(parent, context);

		expect(pathBar).toBeDefined();
	});
});
