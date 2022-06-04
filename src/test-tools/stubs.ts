import { BehaviorController } from '../behaviors/behavior-controller';
import { ComponentType, Definition, Step } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';

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
	return new DesignerContext(createDefinitionStub(), new BehaviorController(), createDesignerConfigurationStub());
}
