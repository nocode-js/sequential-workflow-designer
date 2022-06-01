import { Dom } from '../core/dom';
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
				'true': [],
				'false': []
			},
			type: 'foo'
		};
		const parentSequence: Sequence = [step];

		const parent = Dom.svg('svg');
		const component = SwitchStepComponent.create(parent, step, parentSequence, {});

		expect(component).toBeDefined();
	});
});
