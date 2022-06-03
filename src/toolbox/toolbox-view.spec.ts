import { Dom } from '../core/dom';
import { createDesignerContextFake } from '../designer-context-faker';
import { ToolboxView } from './toolbox-view';

describe('ToolboxView', () => {

	it('create() creates view', () => {
		const parent = Dom.element('div');
		const context = createDesignerContextFake();

		const view = ToolboxView.create(parent, context);

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
