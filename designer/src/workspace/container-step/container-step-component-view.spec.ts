import { Dom } from '../../core/dom';
import { ContainerStep } from '../../definition';
import { createComponentContextStub } from '../../test-tools/stubs';
import { ContainerStepComponentView } from './container-step-component-view';

describe('ContainerStepComponentView', () => {
	it('creates view', () => {
		const step: ContainerStep = {
			id: '0x0',
			componentType: 'container',
			name: 'Foo',
			properties: {},
			sequence: [],
			type: 'foo'
		};

		const parent = Dom.svg('svg');
		const context = createComponentContextStub();
		const view = ContainerStepComponentView.create(parent, step, context);

		expect(view).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
