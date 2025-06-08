/* global window, document, sequentialWorkflowDesigner */

const uid = sequentialWorkflowDesigner.Uid.next;

function createTaskStep(name) {
	return {
		id: uid(),
		componentType: 'task',
		type: 'task',
		name,
		properties: {}
	};
}

function createSwitchStep(name) {
	return {
		id: uid(),
		componentType: 'switch',
		type: 'switch',
		name,
		properties: {},
		branches: {
			true: [],
			false: []
		}
	};
}

function createEditor(text) {
	const editor = document.createElement('div');
	editor.innerText = text;
	return editor;
}

const definition = {
	sequence: [createTaskStep('Save e-mail'), createTaskStep('Read file'), createTaskStep('Delete file'), createSwitchStep('Condition')],
	properties: {}
};
const configuration = {
	theme: 'soft',
	toolbox: {
		groups: [
			{
				name: 'Test',
				steps: Array(20)
					.fill(null)
					.map((_, i) => createTaskStep(`Task ${i}`))
			}
		]
	},
	steps: {},

	editors: {
		rootEditorProvider: () => {
			return createEditor('Please select any step.');
		},
		stepEditorProvider: step => {
			return createEditor(`Selected step: ${step.type}`);
		}
	},
	controlBar: true,
	keyboard: false
};

function init(placeholder) {
	sequentialWorkflowDesigner.Designer.create(placeholder, definition, configuration);
}

function load() {
	const placeholders = [...document.getElementsByClassName('inline-designer')];
	placeholders.forEach(init);
}

window.addEventListener('load', load, false);
