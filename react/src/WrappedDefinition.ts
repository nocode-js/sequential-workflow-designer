import { Definition } from 'sequential-workflow-designer';

export interface WrappedDefinition {
	readonly value: Definition;
	readonly isValid: boolean | undefined;
}

export function wrapDefinition(value: Definition, isValid?: boolean): WrappedDefinition {
	return {
		value,
		isValid
	};
}
