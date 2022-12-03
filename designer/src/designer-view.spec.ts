import { Dom } from './core/dom';
import { DesignerView } from './designer-view';
import { createDesignerConfigurationStub, createDesignerContextStub } from './test-tools/stubs';

describe('DesignerView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');
		const configuration = createDesignerConfigurationStub();
		const context = createDesignerContextStub();

		const view = DesignerView.create(parent, context, context.layoutController, configuration);

		expect(view).toBeDefined();
	});
});
