/* global window, document, sequentialWorkflowDesigner */

function createStep(name) {
	return {
		id: sequentialWorkflowDesigner.Uid.next(),
		componentType: 'task',
		type: 'task',
		name,
		properties: {}
	};
}

function createEditor(text) {
	const editor = document.createElement('div');
	editor.innerText = text;
	return editor;
}

const definition = {
	sequence: [
		createStep('Save e-mail'),
		createStep('Read file'),
		createStep('Delete file'),
	],
	properties: {}
};
const configuration = {
	toolbox: {
		groups: [
			{
				name: 'Test',
				steps: Array(20).fill(null).map((_, i) => createStep(`Task ${i}`))
			}
		]
	},
	steps: {},

	editors: {
		globalEditorProvider: () => {
			return createEditor('Please select any step.');
		},
		stepEditorProvider: (step) => {
			return createEditor(`Selected step: ${step.type}`);
		}
	},
	controlBar: true,
};

function init(placeholder) {
	sequentialWorkflowDesigner.Designer.create(placeholder, definition, configuration);
}

function load() {
	const placeholders = [...document.getElementsByClassName('inline-designer')];
	placeholders.forEach(init);
}

window.addEventListener('load', load, false);
