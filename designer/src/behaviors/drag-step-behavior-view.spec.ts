import { createComponentContextStub, createStepStub } from '../test-tools/stubs';
import { DragStepView } from './drag-step-behavior-view';

describe('DragStepView', () => {
	it('creates view', () => {
		const appendChildSpy = spyOn(document.body, 'appendChild').and.stub();

		const step = createStepStub();
		const componentContext = createComponentContextStub();

		const component = DragStepView.create(step, 'light', componentContext);

		expect(component).toBeDefined();
		expect(appendChildSpy).toHaveBeenCalled();
	});
});
