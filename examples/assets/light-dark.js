/* global window, document, sequentialWorkflowDesigner */

function createStep() {
	return {
		id: '0x0',
		componentType: 'task',
		type: 'task',
		name: 'Open TCP port',
		properties: {}
	};
}

function install(placeholder, theme) {
	const definition = {
		sequence: [
			createStep()
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
						createStep()
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
