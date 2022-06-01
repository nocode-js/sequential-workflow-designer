import { Dom } from '../../core/dom';
import { ComponentType, ContainerStep } from '../../definition';
import { ContainerStepComponentView } from './container-step-component-view';

describe('ContainerStepComponentView', () => {

	it('creates view', () => {
		const step: ContainerStep = {
			id: '0x0',
			componentType: ComponentType.container,
			name: 'Foo',
			properties: {},
			sequence: [],
			type: 'foo'
		};

		const parent = Dom.svg('svg');
		const component = ContainerStepComponentView.create(parent, step, {});

		expect(component).toBeDefined();
	});
});
