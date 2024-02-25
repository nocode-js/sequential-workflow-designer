import { DesignerConfiguration } from '../designer-configuration';

export function validateConfiguration(configuration: DesignerConfiguration) {
	const validateProperty = (key: keyof DesignerConfiguration) => {
		if (configuration[key] === undefined) {
			throw new Error(`The "${key}" property is not defined in the configuration`);
		}
	};

	if (!configuration) {
		throw new Error('Configuration is not defined');
	}

	validateProperty('steps');
	validateProperty('toolbox');
	validateProperty('editors');
	validateProperty('controlBar');
}
