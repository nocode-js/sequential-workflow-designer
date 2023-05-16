import { DesignerConfiguration } from '../designer-configuration';

function throwDepreciatedError(propertyName: string, groupName: string) {
	throw new Error(`The "${propertyName}" property in the "${groupName}" configuration is depreciated`);
}

export function validateConfiguration(configuration: DesignerConfiguration) {
	if (configuration.controlBar === undefined) {
		throw new Error('The "controlBar" property is not defined in the configuration');
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (configuration.toolbox && (configuration.toolbox as any).isHidden !== undefined) {
		throwDepreciatedError('isHidden', 'toolbox');
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (configuration.editors && (configuration.editors as any).isHidden !== undefined) {
		throwDepreciatedError('isHidden', 'editors');
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if ((configuration.steps as any).validator) {
		throwDepreciatedError('validator', 'steps');
	}
}
