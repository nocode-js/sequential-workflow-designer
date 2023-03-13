import { DesignerConfiguration } from './designer-configuration';

export function validateConfiguration(configuration: DesignerConfiguration) {
	if (configuration.controlBar === undefined) {
		throw new Error('The "controlBar" property is not defined in the configuration');
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (configuration.toolbox && (configuration.toolbox as any).isHidden !== undefined) {
		throw new Error('The "isHidden" property in the toolbox configuration is depreciated');
	}
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if (configuration.editors && (configuration.editors as any).isHidden !== undefined) {
		throw new Error('The "isHidden" property in the editors configuration is depreciated');
	}
}
