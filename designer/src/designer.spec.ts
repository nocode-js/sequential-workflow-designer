import { ControlBar } from './control-bar/control-bar';
import { Dom } from './core/dom';
import { SimpleEvent } from './core/simple-event';
import { Designer } from './designer';
import { SmartEditor } from './smart-editor/smart-editor';
import { createDefinitionStub, createDesignerConfigurationStub } from './test-tools/stubs';
import { Toolbox } from './toolbox/toolbox';
import { Workspace } from './workspace/workspace';

describe('Designer', () => {
	it('create() creates designer', () => {
		const workspaceSpy = spyOn(Workspace, 'create').and.returnValues({
			onReady: new SimpleEvent<void>()
		} as Workspace);
		const toolboxSpy = spyOn(Toolbox, 'create');
		const controlBarSpy = spyOn(ControlBar, 'create');
		const smartEditorSpy = spyOn(SmartEditor, 'create');

		const parent = Dom.element('div');
		document.body.appendChild(parent);

		const definition = createDefinitionStub();
		const configuration = createDesignerConfigurationStub();

		const bar = Designer.create(parent, definition, configuration);

		expect(bar).toBeDefined();
		expect(parent.children.length).not.toEqual(0);

		expect(workspaceSpy).toHaveBeenCalled();
		expect(toolboxSpy).toHaveBeenCalled();
		expect(controlBarSpy).toHaveBeenCalled();
		expect(smartEditorSpy).toHaveBeenCalled();

		document.body.removeChild(parent);
	});
});
