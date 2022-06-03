import { ControlBar } from './control-bar/control-bar';
import { Dom } from './core/dom';
import { Definition } from './definition';
import Designer from './designer';
import { DesignerConfiguration } from './designer-configuration';
import { SmartEditor } from './smart-editor/smart-editor';
import { Toolbox } from './toolbox/toolbox';
import { Workspace } from './workspace/workspace';

describe('Designer', () => {

	it('create() creates designer', () => {
		const workspaceSpy = spyOn(Workspace, 'create');
		const tollboxSpy = spyOn(Toolbox, 'create');
		const controlBarSpy = spyOn(ControlBar, 'create');
		const smartEditorSpy = spyOn(SmartEditor, 'create');

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

		const bar = Designer.create(parent, definition, configuration);

		expect(bar).toBeDefined();
		expect(parent.children.length).not.toEqual(0);

		expect(workspaceSpy).toHaveBeenCalled();
		expect(tollboxSpy).toHaveBeenCalled();
		expect(controlBarSpy).toHaveBeenCalled();
		expect(smartEditorSpy).toHaveBeenCalled();
	});
});
