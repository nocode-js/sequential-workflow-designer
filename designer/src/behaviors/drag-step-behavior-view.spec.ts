import { createDesignerConfigurationStub, createComponentContextStub, createStepStub } from '../test-tools/stubs';
import { DragStepView } from './drag-step-behavior-view';

describe('DragStepView', () => {
	it('creates view', () => {
		const appendChildSpy = spyOn(document.body, 'appendChild').and.stub();

		const step = createStepStub();
		const configuration = createDesignerConfigurationStub();
		const componentContext = createComponentContextStub();

		const component = DragStepView.create(step, configuration, componentContext);

		expect(component).toBeDefined();
		expect(appendChildSpy).toHaveBeenCalled();
	});
});
