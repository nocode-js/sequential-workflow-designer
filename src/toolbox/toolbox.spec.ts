import { Dom } from '../core/dom';
import { createDesignerContextFake } from '../designer-context-faker';
import { Toolbox } from './toolbox';

describe('Toolbox', () => {

	it('create() creates toolbox', () => {
		const parent = Dom.element('div');
		const context = createDesignerContextFake();

		const item = Toolbox.create(parent, context);

		expect(item).toBeDefined();
	});
});
