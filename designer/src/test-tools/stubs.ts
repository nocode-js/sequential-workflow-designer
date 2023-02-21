import { ComponentContext } from '../component-context';
import { Definition, Step } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ServicesResolver } from '../services';

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
	const services = ServicesResolver.resolve([]);
	return DesignerContext.create(parent, createDefinitionStub(), createDesignerConfigurationStub(), services);
}

export function createComponentContextStub(): ComponentContext {
	return createDesignerContextStub().componentContext;
}
