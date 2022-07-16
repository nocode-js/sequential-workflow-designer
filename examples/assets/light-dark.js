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
				return document.createElement('div');
			},
			stepEditorProvider: () => {
				return document.createElement('div');
			}
		}
	};
	sequentialWorkflowDesigner.create(placeholder, definition, configuration);
}

window.addEventListener('load', () => {
	install(document.getElementById('light'), 'light');
	install(document.getElementById('dark'), 'dark');
});
