import { Definition, Step } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ComponentContext } from '../workspace/component-context';
import { StepExtensionsResolver } from '../workspace/step-extensions-resolver';

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
		componentType: 'task',
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
	const parent = document.createElement('div');
	const extensions = StepExtensionsResolver.resolve({});
	return DesignerContext.create(parent, createDefinitionStub(), createDesignerConfigurationStub(), extensions);
}

export function createComponentContextStub(): ComponentContext {
	const extensions = StepExtensionsResolver.resolve({});
	return ComponentContext.create(createDesignerConfigurationStub().steps, extensions);
}
