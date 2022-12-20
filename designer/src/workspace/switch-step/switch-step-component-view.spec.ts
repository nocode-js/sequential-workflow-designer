import { Dom } from '../../core/dom';
import { createComponentContextStub } from '../../test-tools/stubs';
import { SwitchStepComponentView } from './switch-step-component-view';

describe('SwitchStepComponentView', () => {
	it('create() creates view', () => {
		const parent = Dom.svg('svg');
		const context = createComponentContextStub();
		SwitchStepComponentView.create(
			parent,
			{
				id: '0x',
				branches: {
					x: [],
					y: []
				},
				componentType: 'switch',
				name: 'x',
				properties: {},
				type: 'test'
			},
			context
		);
		expect(parent.children.length).not.toEqual(0);
	});
});
