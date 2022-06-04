import { ComponentType, Step } from '../definition';
import { StepEditor } from './step-editor';

describe('StepEditor', () => {
	it('create() creates editor', () => {
		const step: Step = {
			componentType: ComponentType.container,
			id: '0x0',
			name: 'x',
			properties: {},
			type: 'foo'
		};

		const component = StepEditor.create(step, () => document.createElement('div'));

		expect(component).toBeDefined();
	});
});
