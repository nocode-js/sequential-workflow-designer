/* global document, sequentialWorkflowDesigner, console */

function createTaskStep(id, type, name) {
	return {
		id,
		componentType: 'task',
		type,
		name,
		properties: {}
	};
}

function createIfStep(id, _true, _false) {
	return {
		id,
		componentType: 'switch',
		type: 'if',
		name: 'If',
		branches: {
			'true': _true,
			'false': _false
		},
		properties: {}
	};
}

function createContainerStep(id, steps) {
	return {
		id,
		componentType: 'container',
		type: 'loop',
		name: 'Loop',
		properties: {},
		sequence: steps
	};
}

function toolboxGroup(name) {
	return {
		name,
		steps: [
			createTaskStep(null, 'save', 'Save file'),
			createTaskStep(null, 'text', 'Send email'),
			createTaskStep(null, 'task', 'Create task'),
			createIfStep(null, [], []),
			createContainerStep(null, [])
		]
	};
}

let designer;
const configuration = {
	undoStackSize: 20,

	toolbox: {
		isHidden: false,
		groups: [
			toolboxGroup('Main'),
			toolboxGroup('File system'),
			toolboxGroup('E-mail')
		]
	},

	steps: {
		iconUrlProvider: (componentType, type) => {
			return `./assets/icon-${type}.svg`
		},

		validator: (step) => {
			return !step.properties['isInvalid'];
		},
	},

	editors: {
		isHidden: false,
		globalEditorProvider: (definition) => {
			const root = document.createElement('div');
			root.innerHTML = '<textarea style="width: 100%; border: 0;" rows="50"></textarea>';
			const textarea = root.getElementsByTagName('textarea')[0];
			textarea.value = JSON.stringify(definition, null, 2);
			return root;
		},

		stepEditorProvider: (step, editorContext) => {
			const root = document.createElement('div');
			root.innerHTML = '<h5></h5> <p>is invalid: <input type="checkbox" /></p>';
			const title = root.getElementsByTagName('h5')[0];
			title.innerText = step.name;
			const input = root.getElementsByTagName('input')[0];
			input.checked = !!step.properties['isInvalid'];
			input.addEventListener('click', () => {
				step.properties['isInvalid'] = !!input.checked;
				editorContext.notifyPropertiesChanged();
			});
			return root;
		}
	}
};

const startDefinition = {
	properties: {},
	sequence: [
		createIfStep('00000000000000000000000000000001',
			[ createTaskStep('00000000000000000000000000000002', 'save', 'Save file') ],
			[ createTaskStep('00000000000000000000000000000003', 'text', 'Send email') ]
		),
		createContainerStep('00000000000000000000000000000004', [
			createTaskStep('00000000000000000000000000000005', 'task', 'Create task')
		])
	]
};

const placeholder = document.getElementById('designer');
designer = sequentialWorkflowDesigner.create(placeholder, startDefinition, configuration);
designer.onDefinitionChanged.subscribe((newDefinition) => {
	console.log('the definition has changed', newDefinition);
});
