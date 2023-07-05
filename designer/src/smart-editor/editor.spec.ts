import { DefinitionWalker } from '../definition';
import { EditorApi } from '../api';
import { DesignerState } from '../designer-state';
import { createDefinitionStub, createDesignerConfigurationStub, createStepStub } from '../test-tools/stubs';
import { DefinitionModifier } from '../definition-modifier';
import { Editor } from './editor';

describe('Editor', () => {
	const step = createStepStub();
	const definition = createDefinitionStub();
	definition.sequence.push(step);

	let parent: HTMLElement;
	let state: DesignerState;
	let api: EditorApi;
	let stepEditorProvider: jasmine.Spy;
	let globalEditorProvider: jasmine.Spy;

	function createEditor() {
		Editor.create(parent, api, 'test-step', stepEditorProvider, 'test-global', globalEditorProvider);
	}

	beforeEach(() => {
		parent = document.createElement('div');

		const configuration = createDesignerConfigurationStub();
		state = new DesignerState(definition, false, false, false);

		const walker = new DefinitionWalker();
		const modifier = new DefinitionModifier(walker, state, configuration);
		api = new EditorApi(state, walker, modifier);

		stepEditorProvider = jasmine.createSpy().and.returnValue(document.createElement('div'));
		globalEditorProvider = jasmine.createSpy().and.returnValue(document.createElement('div'));
	});

	it('calls step editor provider when step is selected', () => {
		state.setSelectedStepId('0x0');

		createEditor();

		expect(stepEditorProvider).toHaveBeenCalledWith(step, jasmine.anything(), definition);
		expect(globalEditorProvider).not.toHaveBeenCalled();
	});

	it('calls global editor provider when step is not selected', () => {
		state.setSelectedStepId(null);

		createEditor();

		expect(stepEditorProvider).not.toHaveBeenCalled();
		expect(globalEditorProvider).toHaveBeenCalledWith(definition, jasmine.anything());
	});
});
