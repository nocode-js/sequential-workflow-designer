/* global window, document, sequentialWorkflowDesigner */

function createStep(id) {
	return {
		id,
		componentType: 'task',
		type: 'task',
		name: 'Open TCP port',
		properties: {}
	};
}

function createEditor(text) {
	const editor = document.createElement('div');
	editor.innerText = text;
	return editor;
}

function install(placeholder, theme) {
	const definition = {
		sequence: [
			createStep('00000000000000000000000000000000')
		],
		properties: {}
	};
	const configuration = {
		theme,
		toolbox: {
			isHidden: false,
			groups: [
				{
					name: 'Tasks',
					steps: [
						createStep(null)
					]
				}
			]
		},

		steps: {
			iconUrlProvider: () => {
				return './assets/icon-task.svg';
			},
			validator: () => {
				return true;
			}
		},

		editors: {
			globalEditorProvider: () => {
				return createEditor('Please select any step.');
			},
			stepEditorProvider: (step) => {
				return createEditor(`Selected step: ${step.type}`);
			}
		}
	};
	sequentialWorkflowDesigner.Designer.create(placeholder, definition, configuration);
}

window.addEventListener('load', () => {
	install(document.getElementById('light'), 'light');
	install(document.getElementById('dark'), 'dark');
});
