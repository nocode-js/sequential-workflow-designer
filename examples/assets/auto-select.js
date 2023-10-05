/* global document, sequentialWorkflowDesigner */

function init(placeholderId, isAutoSelectDisabled) {
	const configuration = {
		steps: {
			iconUrlProvider: () => './assets/icon-task.svg',
			isAutoSelectDisabled
		},
		toolbox: {
			groups: [
				{
					name: 'Steps',
					steps: [
						{
							componentType: 'task',
							type: 'setValue',
							name: 'Set value',
							properties: {}
						}
					]
				}
			]
		},
		editors: false,
		controlBar: true,
	};

	const startDefinition = {
		properties: {},
		sequence: []
	};

	const placeholder = document.getElementById(placeholderId);
	sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);
}

init('designer1', false);
init('designer2', true);
