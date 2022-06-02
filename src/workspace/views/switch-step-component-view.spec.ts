import { Dom } from '../../core/dom';
import { ComponentType } from '../../definition';
import { SwitchStepComponentView } from './switch-step-component-view';

describe('SwitchStepComponentView', () => {

	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		SwitchStepComponentView.create(parent, {
			id: '0x',
			branches: {
				'x': [],
				'y': []
			},
			componentType: ComponentType.switch,
			name: 'x',
			properties: {},
			type: 'test'
		}, {});
		expect(parent.children.length).not.toEqual(0);
	});
});
