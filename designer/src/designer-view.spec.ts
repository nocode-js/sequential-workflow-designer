import { Dom } from './core/dom';
import { DesignerView } from './designer-view';
import { createComponentContextStub, createDesignerConfigurationStub, createDesignerContextStub } from './test-tools/stubs';

describe('DesignerView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');
		const configuration = createDesignerConfigurationStub();
		const designerContext = createDesignerContextStub();
		const componentContext = createComponentContextStub();

		const view = DesignerView.create(parent, designerContext, componentContext, designerContext.layoutController, configuration);

		expect(view).toBeDefined();
	});
});
