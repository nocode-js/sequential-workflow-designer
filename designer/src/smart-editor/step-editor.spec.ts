import { Step } from '../definition';
import { createDesignerContextStub } from '../test-tools/stubs';
import { StepEditor } from './step-editor';

describe('StepEditor', () => {
	it('create() creates editor', () => {
		const step: Step = {
			componentType: 'container',
			id: '0x0',
			name: 'x',
			properties: {},
			type: 'foo'
		};
		const context = createDesignerContextStub();

		const component = StepEditor.create(step, context);

		expect(component).toBeDefined();
	});
});
