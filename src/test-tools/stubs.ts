import { BehaviorController } from '../behaviors/behavior-controller';
import { Dom } from '../core/dom';
import { ComponentType, Definition, Step } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { LayoutController } from '../layout-controller';

export function createDesignerConfigurationStub(): DesignerConfiguration {
	return {
		editors: {
			globalEditorProvider: () => document.createElement('div'),
			stepEditorProvider: () => document.createElement('div')
		},
		steps: {},
		toolbox: {
			groups: []
		}
	};
}

export function createStepStub(): Step {
	return {
		id: '0x0',
		componentType: ComponentType.task,
		name: 'stub',
		properties: {},
		type: 'stub'
	};
}

export function createDefinitionStub(): Definition {
	return {
		properties: {},
		sequence: []
	};
}

export function createDesignerContextStub(): DesignerContext {
	const parent = Dom.element('div');
	const bc = new BehaviorController();
	const lc = new LayoutController(parent);
	return new DesignerContext(createDefinitionStub(), bc, lc, createDesignerConfigurationStub(), false, false);
}
