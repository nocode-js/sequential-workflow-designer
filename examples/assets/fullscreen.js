/* global document, sequentialWorkflowDesigner, console */

function uid() {
	return Math.ceil(Math.random() * 10**16).toString(16);
}

function createTaskStep(type, name) {
	return {
		id: uid(),
		componentType: 'task',
		type,
		name,
		properties: {}
	};
}

function createIfStep(_true, _false) {
	return {
		id: uid(),
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

function createContainerStep(steps) {
	return {
		id: uid(),
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
			createTaskStep('save', 'Save file'),
			createTaskStep('text', 'Send email'),
			createTaskStep('task', 'Create task'),
			createIfStep([], []),
			createContainerStep([])
		]
	};
}

let designer;
const configuration = {
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
		}
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

		stepEditorProvider: (step) => {
			const root = document.createElement('div');
			root.innerHTML = '<h5></h5> <p>is invalid: <input type="checkbox" /></p>';
			const title = root.getElementsByTagName('h5')[0];
			title.innerText = step.name;
			const input = root.getElementsByTagName('input')[0];
			input.checked = !!step.properties['isInvalid'];
			input.addEventListener('click', () => {
				step.properties['isInvalid'] = !!input.checked;
				designer.revalidate();
			});
			return root;
		}
	}
};

const startDefinition = {
	properties: {},
	sequence: [
		createIfStep(
			[ createTaskStep('save', 'Save file') ],
			[ createTaskStep('text', 'Send email') ]
		),
		createContainerStep([
			createTaskStep('task', 'Create task')
		])
	]
};

const placeholder = document.getElementById('designer');
designer = sequentialWorkflowDesigner.create(placeholder, startDefinition, configuration);
designer.onDefinitionChanged.subscribe(() => {
	console.log('the definition has changed');
});
