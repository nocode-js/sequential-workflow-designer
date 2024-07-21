import { BranchedStep } from 'sequential-workflow-model';
import { createComponentContextStub, createStepStub } from '../test-tools/stubs';
import { DragStepView } from './drag-step-behavior-view';

describe('DragStepView', () => {
	let appendChildSpy: jasmine.Spy;
	let removeChildSpy: jasmine.Spy;

	beforeEach(() => {
		appendChildSpy = spyOn(document.body, 'appendChild').and.callThrough();
		removeChildSpy = spyOn(document.body, 'removeChild').and.callThrough();
	});

	it('creates view', () => {
		const step = createStepStub();
		const componentContext = createComponentContextStub();

		const component = DragStepView.create(step, 'light', componentContext);

		expect(component).toBeDefined();
		expect(appendChildSpy).toHaveBeenCalled();
		expect(document.body.getElementsByClassName('sqd-drag').length).toBe(1);

		component.remove();

		expect(removeChildSpy).toHaveBeenCalled();
		expect(document.body.getElementsByClassName('sqd-drag').length).toBe(0);
	});

	it('does not create any placeholder', () => {
		const step: BranchedStep = {
			id: 'f00',
			componentType: 'switch', // This component should have at least 2 placeholders if it is not rendered as a preview.
			name: 'Foo',
			properties: {},
			branches: {
				true: [],
				false: []
			},
			type: 'foo'
		};
		const componentContext = createComponentContextStub();
		const createForGapSpy = spyOn(componentContext.services.placeholder, 'createForGap').and.callThrough();
		const createForAreaSpy = spyOn(componentContext.services.placeholder, 'createForArea').and.callThrough();

		const component = DragStepView.create(step, 'light', componentContext);

		expect(component).toBeDefined();
		expect(appendChildSpy).toHaveBeenCalled();
		expect(createForGapSpy).not.toHaveBeenCalled();
		expect(createForAreaSpy).not.toHaveBeenCalled();

		component.remove();

		expect(removeChildSpy).toHaveBeenCalled();
	});
});
