import { ComponentType, Sequence, SwitchStep } from '../definition';
import { SwitchStepComponent } from './switch-step-component';

describe('SwitchStepComponent', () => {

	it('creates component', () => {
		const step: SwitchStep = {
			id: '0x0',
			componentType: ComponentType.switch,
			name: 'Foo',
			properties: {},
			branches: {
				'true': { steps: [] },
				'false': { steps: [] }
			},
			type: 'foo'
		};
		const parentSequence: Sequence = {
			steps: [step]
		};

		const component = SwitchStepComponent.create(step, parentSequence, {});

		expect(component).toBeDefined();
	});
});
