import { DesignerApi } from '../api/designer-api';
import { ComponentContext } from '../component-context';
import { Definition, Step } from '../definition';
import { DesignerConfiguration, EditorsConfiguration, ToolboxConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { ServicesResolver } from '../services';

export function getEditorsConfigurationStub(): EditorsConfiguration {
	return {
		globalEditorProvider: () => document.createElement('div'),
		stepEditorProvider: () => document.createElement('div')
	};
}

export function getToolboxConfigurationStub(): ToolboxConfiguration {
	return {
		groups: []
	};
}

export function createDesignerConfigurationStub(): DesignerConfiguration {
	return {
		editors: getEditorsConfigurationStub(),
		steps: {},
		toolbox: getToolboxConfigurationStub(),
		controlBar: true
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
	const configuration = createDesignerConfigurationStub();
	const services = ServicesResolver.resolve([], configuration);
	return DesignerContext.create(parent, createDefinitionStub(), createDesignerConfigurationStub(), services);
}

export function createComponentContextStub(): ComponentContext {
	return createDesignerContextStub().componentContext;
}

export function createDesignerApiStub(designerContext?: DesignerContext): DesignerApi {
	if (!designerContext) {
		designerContext = createDesignerContextStub();
	}
	return DesignerApi.create(designerContext);
}
