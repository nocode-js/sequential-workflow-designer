import { Dom } from '../core/dom';
import { createDesignerContextFake } from '../designer-context-faker';
import { Workspace } from './workspace';

describe('Workspace', () => {

	it('create() creates bar', () => {
		const parent = Dom.element('div');
		const context = createDesignerContextFake();

		const bar = Workspace.create(parent, context);

		expect(bar).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
