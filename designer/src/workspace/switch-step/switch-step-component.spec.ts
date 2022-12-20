import { Dom } from '../../core/dom';
import { Sequence, SwitchStep } from '../../definition';
import { createComponentContextStub, createStepStub } from '../../test-tools/stubs';
import { SwitchStepComponent } from './switch-step-component';

describe('SwitchStepComponent', () => {
	it('creates component', () => {
		const step: SwitchStep = {
			id: '0x0',
			componentType: 'switch',
			name: 'Foo',
			properties: {},
			branches: {
				true: [createStepStub()],
				false: [createStepStub()]
			},
			type: 'foo'
		};
		const parentSequence: Sequence = [step];

		const parent = Dom.svg('svg');
		const context = createComponentContextStub();
		const component = SwitchStepComponent.create(parent, step, parentSequence, context);

		expect(component).toBeDefined();
	});
});
