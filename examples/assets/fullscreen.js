/* global document, sequentialWorkflowDesigner, console */

function createTaskStep(id, type, name, properties) {
	return {
		id,
		componentType: 'task',
		type,
		name,
		properties: properties || {}
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

function reloadChangeReadonlyButtonText() {
	changeReadonlyButton.innerText = 'Readonly: ' + (designer.isReadonly() ? 'ON' : 'OFF');
}

function appendCheckbox(root, label, isChecked, onClick) {
	const item = document.createElement('div');
	item.innerHTML = '<div><h5></h5> <input type="checkbox" /></div>';
	const h5 = item.getElementsByTagName('h5')[0];
	h5.innerText = label;
	const input = item.getElementsByTagName('input')[0];
	input.checked = isChecked;
	input.addEventListener('click', () => {
		onClick(input.checked);
	});
	root.appendChild(item);
}

let designer;
let changeReadonlyButton;
let validationStatusText;

function refreshValidationStatus() {
	validationStatusText.innerText = designer.isValid() ? 'Definition is valid' : 'Definition is invalid';
}

const configuration = {
	undoStackSize: 20,

	toolbox: {
		groups: [
			toolboxGroup('Main'),
			toolboxGroup('File system'),
			toolboxGroup('E-mail')
		]
	},

	controlBar: true,

	steps: {
		iconUrlProvider: (componentType, type) => {
			return `./assets/icon-${type}.svg`
		},
	},

	validator: {
		step: (step) => {
			return !step.properties['isInvalid'];
		}
	},

	editors: {
		globalEditorProvider: (definition) => {
			const root = document.createElement('div');
			root.innerHTML = '<textarea style="width: 100%; border: 0;" rows="50"></textarea>';
			const textarea = root.getElementsByTagName('textarea')[0];
			textarea.value = JSON.stringify(definition, null, 2);
			return root;
		},

		stepEditorProvider: (step, editorContext) => {
			const root = document.createElement('div');

			appendCheckbox(root, 'Is invalid', !!step.properties['isInvalid'], (checked) => {
				step.properties['isInvalid'] = checked;
				editorContext.notifyPropertiesChanged();
			});

			if (step.type === 'if') {
				appendCheckbox(root, 'Catch branch', !!step.branches['catch'], (checked) => {
					if (checked) {
						step.branches['catch'] = [];
					} else {
						delete step.branches['catch'];
					}
					editorContext.notifyChildrenChanged();
				});
			}
			return root;
		}
	}
};

const startDefinition = {
	properties: {},
	sequence: [
		createIfStep('00000000000000000000000000000001',
			[ createTaskStep('00000000000000000000000000000002', 'save', 'Save file', { isInvalid: true }) ],
			[ createTaskStep('00000000000000000000000000000003', 'text', 'Send email') ]
		),
		createContainerStep('00000000000000000000000000000004', [
			createTaskStep('00000000000000000000000000000005', 'task', 'Create task')
		])
	]
};

const placeholder = document.getElementById('designer');
designer = sequentialWorkflowDesigner.Designer.create(placeholder, startDefinition, configuration);
designer.onDefinitionChanged.subscribe((newDefinition) => {
	refreshValidationStatus();
	console.log('the definition has changed', newDefinition);
});

changeReadonlyButton = document.getElementById('changeReadonlyButton');
changeReadonlyButton.addEventListener('click', () => {
	designer.setIsReadonly(!designer.isReadonly());
	reloadChangeReadonlyButtonText();
});
reloadChangeReadonlyButtonText();

validationStatusText = document.getElementById('validationStatus');
refreshValidationStatus();
