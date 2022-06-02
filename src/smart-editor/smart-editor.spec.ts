import { BehaviorController } from '../behaviors/behavior-controller';
import { Dom } from '../core/dom';
import { Definition } from '../definition';
import { DesignerConfiguration } from '../designer-configuration';
import { DesignerContext } from '../designer-context';
import { SmartEditor } from './smart-editor';

describe('SmartEditor', () => {

	it('create() creates editor', () => {
		const parent = Dom.element('div');
		const definition: Definition = {
			properties: {},
			sequence: []
		};
		const configuration: DesignerConfiguration = {
			editors: {
				globalEditorProvider: () => document.createElement('div'),
				stepEditorProvider: () => document.createElement('div')
			},
			steps: {},
			toolbox: {
				groups: []
			}
		};
		const bc = new BehaviorController();

		const context = new DesignerContext(definition, bc, configuration);

		const editor = SmartEditor.create(parent, context);

		expect(editor).toBeDefined();
		expect(parent.children.length).not.toEqual(0);
	});
});
