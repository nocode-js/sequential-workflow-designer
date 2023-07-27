import { Dom } from './core/dom';
import { DesignerView } from './designer-view';
import { createDesignerApiStub, createDesignerContextStub } from './test-tools/stubs';

describe('DesignerView', () => {
	it('create() creates view', () => {
		const parent = Dom.element('div');
		const designerContext = createDesignerContextStub();
		const api = createDesignerApiStub(designerContext);

		const view = DesignerView.create(parent, designerContext, api);

		expect(view).toBeDefined();
	});
});
