import { BehaviorController } from './behaviors/behavior-controller';
import { Definition } from './definition';
import { DesignerConfiguration } from './designer-configuration';
import { DesignerContext } from './designer-context';

export function createDesignerContextFake(): DesignerContext {
	const definition: Definition = {
		properties: {},
		sequence: []
	};
	const configuration: DesignerConfiguration = {
		editors: {
			globalEditorProvider: () => document.createElement('div'),
			stepEditorProvider: () => document.createElement('div')
		},
		steps: {
		},
		toolbox: {
			groups: []
		}
	};
	return new DesignerContext(definition, new BehaviorController(), configuration);
}
