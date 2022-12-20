import { Dom } from '../../core/dom';
import { ContainerStep, Sequence } from '../../definition';
import { createComponentContextStub } from '../../test-tools/stubs';
import { ContainerStepComponent } from './container-step-component';

describe('ContainerStepComponent', () => {
	it('create() creates component', () => {
		const step: ContainerStep = {
			id: '0x0',
			componentType: 'container',
			name: 'Foo',
			properties: {},
			type: 'foo',
			sequence: []
		};
		const parentSequence: Sequence = [step];

		const parent = Dom.svg('svg');
		const context = createComponentContextStub();
		const component = ContainerStepComponent.create(parent, step, parentSequence, context);

		expect(component).toBeDefined();
	});
});
