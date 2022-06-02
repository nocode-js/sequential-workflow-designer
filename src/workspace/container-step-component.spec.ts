import { Dom } from '../core/dom';
import { ComponentType, ContainerStep, Sequence } from '../definition';
import { ContainerStepComponent } from './container-step-component';

describe('ContainerStepComponent', () => {

	it('create() creates component', () => {
		const step: ContainerStep = {
			id: '0x0',
			componentType: ComponentType.container,
			name: 'Foo',
			properties: {},
			type: 'foo',
			sequence: []
		};
		const parentSequence: Sequence = [step];

		const parent = Dom.svg('svg');
		const component = ContainerStepComponent.create(parent, step, parentSequence, {});

		expect(component).toBeDefined();
	});
});
